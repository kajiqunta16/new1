import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

/* =====================
   User Interface
===================== */

interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

interface IOrderItem {
    orderId: mongoose.Types.ObjectId;
    orderDate: Date;
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    cart: ICartItem[];
    order: IOrderItem[];

    comparePassword(enteredPassword: string): Promise<boolean>;
}

/* =====================
   Schema
===================== */

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cart: [
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
    order: [
        {
            orderId: {
                type: Schema.Types.ObjectId,
                ref: "Order",
                required: true
            },
            orderDate: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

/* =====================
   Hooks
===================== */

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/* =====================
   Methods
===================== */

UserSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

/* =====================
   Model
===================== */

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
