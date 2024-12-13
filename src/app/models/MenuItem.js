import mongoose, { model, models, Schema } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});

const MenuItemSchema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Description is required'], // Make it required
    },
    category: {
      type: mongoose.Types.ObjectId,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'], // Make it required
    },
    sizes: {
      type: [ExtraPriceSchema],
    },
    extraIngredientPrices: {
      type: [ExtraPriceSchema],
    },
  },
  { timestamps: true }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
