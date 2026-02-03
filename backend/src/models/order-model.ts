import mongoose, { Schema, Document, Model } from "mongoose";

/* =====================
   Order Interfaces
===================== */

interface IOrderProduct {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export interface IOrder extends Document {
    name: string;
    userId: mongoose.Types.ObjectId;
    products: IOrderProduct[];
    totalAmount: number;
    orderDate: Date;
    status: OrderStatus;
}

/* =====================
   Schema
===================== */

const OrderSchema: Schema<IOrder> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    }
});

/* =====================
   Model
===================== */

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
