import plan from "../models/plan.js";
import User from "../models/user.js";
import stripe from "../services/stripeService.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    const { planType } = req.body;
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: user.email,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

