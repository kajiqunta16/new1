import mongoose, { Schema, Document, Model } from "mongoose";

/* =====================
   Cart Interfaces
===================== */

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

/* =====================
   Schema
===================== */

const CartSchema: Schema<ICart> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    { timestamps: true }
);

/* =====================
   Model
===================== */

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
