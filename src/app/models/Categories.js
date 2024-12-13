import mongoose, { model, models, Schema } from "mongoose";


const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },

}, {timestamps: true});

export const Category = models?.Category || mongoose.model('Category', CategorySchema);