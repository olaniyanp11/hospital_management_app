import mongoose from "mongoose";
import Staff from "./models/staff.js";
import patientdata from "./patientdata.js";
import Patient from "./models/patient.js";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DB_URL);

async function updateDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database.");

    // Update the database schema
    console.log("Updating the database schema...");
    await Patient.insertMany(patientdata);

    console.log("Database update successful.");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    // Disconnect from MongoDB
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

// Run the update script
updateDatabase();
