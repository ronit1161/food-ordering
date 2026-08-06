import mongoose from "mongoose";
import { User } from "../../models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return Response.json(
        { error: "Password must be at least 5 characters long" },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.NEXT_MONGO_URL);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const createdUserObject = createdUser.toObject();
    delete createdUserObject.password;

    return Response.json(createdUserObject, { status: 201 });
  } catch (error) {
    console.error("Error in registration:", error);
    return Response.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
