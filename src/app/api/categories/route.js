import { Category } from "@/app/models/Categories";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Helper function to connect to the database
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }
}

// POST: Create a new category
export async function POST(req) {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Parse the request body
    const { name } = await req.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Category name must be provided" },
        { status: 400 }
      );
    }

    // Create and save the new category
    const newCategory = new Category({ name });
    await newCategory.save();

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Parse the request body
    const { _id, name } = await req.json();

    // Validate input
    if (!_id && !name) {
      return NextResponse.json({ error: 'Category ID and name must be provided' }, { status: 400 });
    }

    // Update the category by _id
    const result = await Category.updateOne({ _id }, { name });

    // Handle non-existing categories
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Fetch all categories
    const categories = await Category.find();

    // Return the categories
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Extract _id from the URL
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (!_id) {
      return NextResponse.json({ error: 'Category ID not provided' }, { status: 400 });
    }

    // Delete the category by _id
    const result = await Category.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
