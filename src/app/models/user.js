import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    image: { type: String },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a model based on the schema
export const User = mongoose.models.User || mongoose.model("User", userSchema);
