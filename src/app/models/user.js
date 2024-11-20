import bcrypt from "bcrypt";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: pass => {
      if (!pass?.length || pass.length < 5) {
        throw new Error("Password must be at least 5 characters");
      }
    },
  },
  image: {
    type: String,
  }
}, { timestamps: true });

UserSchema.post('validate', (user) => {
    const notHashedPassword = user.password;
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(notHashedPassword, salt);
})

export const User = models?.User || model('User', UserSchema);

