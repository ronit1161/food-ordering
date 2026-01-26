import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  image: { type: String },
  admin: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.model("User", userSchema);

export { User };
