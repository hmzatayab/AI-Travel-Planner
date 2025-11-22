import plan from "../models/plan.js";
import User from "../models/user.js";
import stripe from "../services/stripeService.js";
import redis from "../utils/redis.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    const { planType, idempotencyKey } = req.body;

    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency key is required.",
      });
    }

    const isDuplicate = await redis.get(`pay:${idempotencyKey}`);
    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: "Duplicate request. Payment already processing.",
      });
    }

    await redis.set(`pay:${idempotencyKey}`, "locked", "EX", 300);

    if (!planType) {
      return res
        .status(400)
        .json({ success: false, message: "Plan type is required." });
    }

    const planPrices = {
      Gold: process.env.STRIPE_PRICE_GOLD,
      Silver: process.env.STRIPE_PRICE_SILVER,
    };

    const priceId = planPrices[planType];
    if (!priceId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan type." });
    }

    const user = await User.findById(userId).select("email");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.CLIENT_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        customer_email: user.email,

        metadata: {
          priceId: priceId,
          planType: planType,
          userId: userId,
        },
      },
      {
        idempotencyKey: `pay-${idempotencyKey}`,
      }
    );

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const user = await User.findOne({ email: session.customer_email });
      if (!user) {
        console.error("User not found");
        return res.status(404).send("User not found");
      }

      const priceId =
        session.metadata?.priceId || session.display_items?.[0]?.price?.id;

      const planMapping = {
        [process.env.STRIPE_PRICE_GOLD]: {
          name: "Gold",
          credits: 1000,
          price: 19.99,
          description: "Gold plan with premium features",
          features: ["Unlimited AI Trips", "Fast Response", "Priority Support"],
        },
        [process.env.STRIPE_PRICE_SILVER]: {
          name: "Silver",
          credits: 500,
          price: 9.99,
          description: "Silver plan with standard features",
          features: ["AI Trips", "Standard Response"],
        },
      };

      const selectedPlan = planMapping[priceId];
      if (!selectedPlan) {
        console.error("Invalid plan inside webhook");
        return res.status(400).send("Invalid plan");
      }

      let existingPlan = await plan.findOne({ userId: user._id });

      if (existingPlan) {
        existingPlan.name = selectedPlan.name;
        existingPlan.description = selectedPlan.description;
        existingPlan.features = selectedPlan.features;
        existingPlan.price = selectedPlan.price;
        existingPlan.aiCredits = selectedPlan.credits;
        existingPlan.currency = "USD";
        existingPlan.durationDays = 30;
        existingPlan.creditCostPerTrip = 10;

        await existingPlan.save();

        console.log("Plan updated for user:", existingPlan);
        return res.json({
          success: true,
          message: "Plan updated successfully",
        });
      }

      return res.json({ success: true, message: "Plan created successfully" });
    } catch (err) {
      console.error("Error processing webhook:", err);
      return res.status(500).send("Server Error");
    }
  }

  res.json({ received: true });
};
