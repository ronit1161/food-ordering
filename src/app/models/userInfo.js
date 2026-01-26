import { Schema, model, models } from "mongoose";

const UserInfoSchema = new Schema(
  {
    email: { type: String, required: true },
    image: { type: String },
    phone: { type: String },
    streetAddress: { type: String }, // Added streetAddress
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }, // Added country
    isAdmin: { 
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserInfo = models?.UserInfo || model("UserInfo", UserInfoSchema);
