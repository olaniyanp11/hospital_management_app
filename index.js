import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import multer from "multer";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import check from "./middlewares/check.js";
import staffrouter from "./Routes/staff.js";
import patientrouter from "./Routes/patient.js" 
// import adminrouter from "./Routes/admin.js";

const app = express();
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
app.use(check);
app.use(cookieParser());
app.use(express.json());
app.use("/staff", staffrouter);
app.use("/patient", patientrouter);
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.json("welcome to hospital");
});
// app.post('/user/signup')

app.all("*", (req, res) => {
  res.status(401).json("page not found");
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
