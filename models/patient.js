import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
  {
    surname: String,
    firstname: {
      type: String,
      required: true,
    },
    gender: String,
    age: String,
    bloodGroup: String,
    genotype: String,
    dateOfBirth: Date,
    contactNumber: Number,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Simple email validation using a regular expression
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let Patient = mongoose.model("Patient", patientSchema);
export default Patient;
