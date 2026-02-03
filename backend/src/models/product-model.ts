import mongoose, { Schema, Document, Model } from "mongoose";

/* =====================
   Product Interface
===================== */

export interface IProduct extends Document {
    image: string;
    category: string;
    name: string;
    short_description?: string | null;
    description: string;
    price: number;
    list_price?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

/* =====================
   Schema
===================== */

const ProductSchema: Schema<IProduct> = new Schema(
    {
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        short_description: {
            type: String,
            default: null
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        list_price: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/* =====================
   Model
===================== */

const Product: Model<IProduct> = mongoose.model<IProduct>(
    "Product",
    ProductSchema
);

export default Product;
