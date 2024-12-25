import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

// Create a model based on the schema
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { User };
