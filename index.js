import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import multer from "multer";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();
app.use(express.urlencoded({ extended: true }));
import check from "./middlewares/check.js";
import staffrouter from "./Routes/staff.js";
import patientrouter from "./Routes/patient.js";
import doctorrouter from "./Routes/Doctors.js";
import nocache from "nocache";
// import adminrouter from "./Routes/admin.js";

// declarations
let port = process.env.PORT;
let DB_URL = process.env.DB_URL;
let NODE_ENV = process.env.NODE_ENV;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`connected to database`);
  })
  .catch((err) => {
    console.log("error connecting to database : " + err.message);
  });

// app middle wares
app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(check);
app.use(cookieParser());
app.use(express.json());
app.use("/staff", staffrouter);
app.use("/patient", patientrouter);
app.use("/doctor", doctorrouter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());
// routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/services", (req, res) => {
  res.render("services");
});
// app.post('/user/signup')

app.all("*", (req, res) => {
  res.status(401).json("page not found");
});


app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
