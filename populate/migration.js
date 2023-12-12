import mongoose from "mongoose";
import Staff from "./models/staff.js";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DB_URL);

async function updateDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to the database.");

    // Update the database schema
    console.log("Updating the database schema...");
    await Staff.updateMany({}, { $set: { contactNumber: null } });

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
