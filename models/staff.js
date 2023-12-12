import mongoose from "mongoose";

const staffSchema = mongoose.Schema(
  {
    surname: String,
    firstname: {
      type: String,
      required: true,
    },
    role: String,
    position: String,
    bloodGroup: String,
    genotype: String,
    dateOfBirth: Date,
    contactNumber: String,
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

let Staff = mongoose.model("Staff", staffSchema);
export default Staff;
