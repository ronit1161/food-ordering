import mongoose from "mongoose";
import { MenuItem } from "../../models/MenuItem";

export async function POST(req) {
  try {
    // Ensure mongoose is connected
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    const data = await req.json();

    // Validate that the required fields are provided
    if (!data.description || !data.basePrice || !data.name) {
      return new Response(
        JSON.stringify({ error: "Name, Description, and Base Price are required" }),
        { status: 400 }
      );
    }

    // Create the new MenuItem in the database
    const menuItemDoc = await MenuItem.create(data);

    // Return the newly created menu item as a response
    return new Response(JSON.stringify(menuItemDoc), { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.NEXT_MONGO_URL);
  const { _id, description, basePrice, ...data } = await req.json();

  // Ensure that the required fields are provided during the update
  if (!description || !basePrice) {
    return new Response(
      JSON.stringify({ error: "Description and Base Price are required" }),
      { status: 400 }
    );
  }

  // Update the MenuItem by ID
  await MenuItem.findByIdAndUpdate(_id, data);
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.NEXT_MONGO_URL);
  return Response.json(await MenuItem.find());
}

export async function DELETE(req) {
  try {
    // Ensure mongoose is connected
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    // Extract _id from query parameters
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (!_id) {
      return new Response(
        JSON.stringify({ error: "Category ID not provided" }),
        {
          status: 400,
        }
      );
    }

    // Delete the category by _id
    const result = await MenuItem.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}