import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Plan from "../models/plan.js";

export const registerUser = async (req, res) => {
  try {
    const { username, name, email, password, country, city } = req.body;

    let errors = {};
    if (!username) errors.username = "Username is required.";
    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (email && !emailRegex.test(email)) errors.email = "Enter a valid email.";
    if (username && !usernameRegex.test(username))
      errors.username =
        "Username must be 3-30 characters, letters/numbers/_ only.";
    if (password && password.length < 6)
      errors.password = "Password must be at least 6 characters.";

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed.", errors });
    }

    if (await User.findOne({ email }))
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    if (await User.findOne({ username }))
      return res
        .status(400)
        .json({ success: false, message: "Username is already taken." });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      passwordHash,
      country: country || "",
      city: city || "",
      savedTrips: [],
      isBlocked: false,
      role: "user",
    });

    await newUser.save();

    const defaultPlan = new Plan({
      name: "Free Plan",
      description: "Default free plan for new users",
      price: 0,
      currency: "USD",
      durationDays: 30,
      aiCredits: 50,
      creditCostPerTrip: 10,
      features: ["Basic AI trips", "Limited support"],
      isActive: true,
      userId: newUser._id,
    });

    await defaultPlan.save();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + defaultPlan.durationDays);

    newUser.subscription = {
      planId: defaultPlan._id,
      startDate,
      endDate,
      status: "active",
    };

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        country: newUser.country,
        city: newUser.city,
        subscriptionStatus: newUser.subscription.status,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    let errors = {};

    if (!emailOrUsername)
      errors.emailOrUsername = "Email or username is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    const invalidResponse = {
      success: false,
      message: "Invalid username or password.",
    };

    if (!user) return res.status(400).json(invalidResponse);

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json(invalidResponse);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        country: user.country,
        city: user.city,
        subscription: user.subscription,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully!" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email." });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const resetUrl = `http://localhost:5175/reset-password/${resetToken}`;
    const message = `You requested a password reset.\n\nClick here to reset: ${resetUrl}\n\nThis link expires in 10 minutes.`;

    console.log("🔑 Password Reset Token:", resetToken);
    console.log("🔗 Reset URL:", resetUrl);
    console.log("📩 Message (simulated email):\n", message);

    // await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Reset email sent successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending reset email.", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    const { newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password.", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserPlan = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const plan = await Plan.findOne({ userId });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "No plan found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User plan retrieved successfully.",
      plan,
    });
  } catch (error) {
    console.error("Get User Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
      error: error.message,
    });
  }
};
