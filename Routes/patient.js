import express from "express";
import Patient from "../models/patient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkPatientCookie from "../middlewares/checkPatientcookie.js";
// import { emit } from "nodemon";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const {
    surname,
    firstname,
    gender,
    age,
    bloodGroup,
    genotype,
    dateOfBirth,
    email,
    contactNumber,
    password,
  } = req.body;

  // Hash the password before saving it to the database
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Check if the patient with the given email already exists
    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.redirect(
        "/patient/signup?emailerr=email exists try another one&status=true"
      );
    }
    if (password.length <= 4) {
      return res.redirect(
        "/patient/signup?passerror=password is too short&status=true"
      );
    }
    // Create a new Patient member
    const newPatient = new Patient({
      surname,
      firstname,
      gender,
      age,
      bloodGroup,
      genotype,
      dateOfBirth,
      email,
      contactNumber,
      password: hashedPassword,
    });

    // Save the new Patient member to the database
    await newPatient.save();

    return res.status(201).json({ message: "patient created successfully" });
  } catch (error) {
    console.error("Error creating new patient:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/signup", (req, res) => {
  const emailerr = req.query.emailerr;
  const passerror = req.query.passerror;
  const status = req.query.status;
  const error = {
    emailerr,
    passerror,
    status,
  };
  res.render("auth/signup", { error });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.redirect(
      "/patient/login?message=Email and password are required&status=true"
    );
  }
  try {
    // Find the patient with the given email
    const patient = await Patient.findOne({ email: email });
    // Check if the patient exists and if the password is correct
    if (!patient)
      return res.redirect("/patient/login?emailerr=invalid Email&status=true");
    if (bcrypt.compareSync(password, patient.password)) {
      const exp = Date.now() + 60 * 60 * 1000 * 24;
      const token = jwt.sign({ patient_id: patient._id }, process.env.SECRETE, {
        expiresIn: exp,
      });
      res.cookie("Authentication", token, { maxAge: exp, httpOnly: true });
      return res.status(200).render("patients/dashboard", { patient });
    } else {
      return res.redirect(
        "/patient/login?passerror=Invalid password&status=true"
      );
    }
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/login", (req, res) => {
  const message = req.query.message;
  const emailerr = req.query.emailerr;
  const passerror = req.query.passerror;
  const status = req.query.status;
  const error = {
    message,
    emailerr,
    passerror,
    status,
  };
  res.render("auth/Login", { error: error });
});

router.get("/logout", (req, res) => {
  res.clearCookie("Authentication");
  req.patient = null;
  res.status(200).json("patient logout");
});

// update
router.get("/update/:id", checkPatientCookie, async (req, res) => { 
  console.log("update");
  try {
    let patient_id = req.params.id;
    let patient = await Patient.findOne({ _id: patient_id });
    if (!patient) {
      res.status(401).json("patient not found ");
    }
    const { surname, firstname, bloodGroup, genotype, dateOfBirth, email } =
      req.body;
    if (!firstname || !email) {
      return res
        .status(400)
        .json({ error: "All fields are required for update" });
    }
    patient.surname = surname;
    patient.firstname = firstname;
    patient.bloodGroup = bloodGroup;
    patient.genotype = genotype;
    patient.dateOfBirth = dateOfBirth;
    patient.email = email;
    await patient.save();
    res.status(200).json("updated user");
  } catch (error) {
    console.error(error);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const patient_id = req.params.id;
    let deletedPatient = await Patient.findOneAndDelete({ _id: patient_id });
    if (!deletedPatient) {
      // If no patient is found with the given ID
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json("deleted patient successfully");
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/test", (req, res) => {
  console.log("wait");
  res.json(req.body);
});

// get all patients
router.get("/all", checkPatientCookie, async (req, res) => {
  let patients = await Patient.find();
  res.json({ patients: patients });
});

// home route
router.get("/", checkPatientCookie, (req, res) => {
  res.json("welcome");
});

export default router;
