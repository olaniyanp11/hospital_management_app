import express from "express";
import checkCookie from "../middlewares/checkCookie.js";
import Staff from "../models/staff.js";
import Appointment from "../models/appointment.js";

const router = express.Router();

router.get("/", checkCookie, async (req, res) => {
  let Doctors = await Staff.find({ position: "doctor" });
  Doctors = Doctors.map((doctor) => {
    return {id :doctor._id , firstname :doctor.firstname ,createdAt: doctor.createdAt};
  });
  res.status(200).json(Doctors);
});


export default router;
