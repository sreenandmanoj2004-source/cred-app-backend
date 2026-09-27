import HttpError from "../helpers/httpError.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. USER REGISTER
export const userRegister = async (req, res, next) => {
  try {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return next(new HttpError("All fields are required", 400));
    }

    // Name validations (Enforced for everyone)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName)) {
      return next(new HttpError("First name must only contain characters", 400));
    }
    if (!nameRegex.test(lastName)) {
      return next(new HttpError("Last name must only contain characters", 400));
    }

    // --- CONDITIONALLY ENFORCE PASSWORD RULES FOR USERS ONLY ---
    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    if (!isAdminEmail) {
      const specialCharRegex = /[^A-Za-z0-9]/;
      const startsWithDigitRegex = /^\d/;

      if (startsWithDigitRegex.test(password)) {
        return next(new HttpError("Password must not start with a digit", 400));
      }

      if (!specialCharRegex.test(password)) {
        return next(new HttpError("Password must include at least one special character", 400));
      }
    }
    // -----------------------------------------------------------

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Dynamic assignment of role based on admin email config
    const assignedRole = isAdminEmail ? "admin" : "user";

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: assignedRole, 
    });

    await newUser.save();

    // 🔑 JWT TOKEN
    const token = jwt.sign(
      {
        user_id: newUser._id,
        email: newUser.email, 
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      accessToken: token,
    });

  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

// 2. USER LOGIN
export const userLogin = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Email and password are required", 400));
    }

    // --- CONDITIONALLY ENFORCE PASSWORD RULES FOR USERS ONLY ---
    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

    if (!isAdminEmail) {
      const specialCharRegex = /[^A-Za-z0-9]/;
      const startsWithDigitRegex = /^\d/;

      if (startsWithDigitRegex.test(password)) {
        return next(new HttpError("Invalid email or password structural format", 401));
      }

      if (!specialCharRegex.test(password)) {
        return next(new HttpError("Invalid email or password structural format", 401));
      }
    }
    // -----------------------------------------------------------

    const user = await User.findOne({ email }).select(
      "_id firstName lastName email role password"
    );

    if (!user) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new HttpError("Invalid email or password", 401));
    }

    // 🔑 JWT TOKEN
    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email, 
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: token,
    });

  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};