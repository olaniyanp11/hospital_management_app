import express from "express";
import Staff from "../models/staff.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkCookie from "../middlewares/checkCookie.js";


const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const {
    surname,
    firstname,
    role,
    bloodGroup,
    genotype,
    dateOfBirth,
    email,
    password,
  } = req.body;

  // Hash the password before saving it to the database
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Check if the user with the given email already exists
    const existingUser = await Staff.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Create a new staff member
    const newStaff = new Staff({
      surname,
      firstname,
      role,
      bloodGroup,
      genotype,
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    // Save the new staff member to the database
    await newStaff.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating new user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the given email
    const user = await Staff.findOne({ email });

    // Check if the user exists and if the password is correct
    if (user && bcrypt.compareSync(password, user.password)) {
      const exp = Date.now() + 60 * 60 * 1000 * 24;
      const token = jwt.sign(
        { user_id: user._id, role: user.role },
        process.env.SECRETE,
        { expiresIn: exp }
      );
      res.cookie("Authentication", token, { maxAge: exp, httpOnly: true });
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
    res.clearCookie("Authentication")
    req.user = null
    res.status(200).json("user logout")
})

// home route
router.get("/", checkCookie, (req, res) => {
  res.json("welcome");
});

export default router;
