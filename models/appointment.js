import mongoose from "mongoose";

const appointmentschema = mongoose.Schema(
  {
    Time: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    Patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    Doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
    },
  },
  { timestamps: true }
);

let Appointment = mongoose.model("Appointment", appointmentschema);
export default Appointment;
