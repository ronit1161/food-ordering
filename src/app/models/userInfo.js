import { Schema, model, models } from "mongoose";

const UserInfoSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    isAdmin: { // Changed from "admin" to "isAdmin"
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserInfo = models?.UserInfo || model("UserInfo", UserInfoSchema);
