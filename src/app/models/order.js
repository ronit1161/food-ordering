import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema({
    userEmail: String,
    phone: String,
    address: String,
    postalCode: String,
    city: String,
    cartProducts: Object,
    paid: { type: Boolean, default: false},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema)