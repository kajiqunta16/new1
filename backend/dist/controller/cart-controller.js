"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseQuantity = exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart-model"));
/* =====================
   Add to Cart
===================== */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { userId } = req.params;
        let cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            cart = new cart_model_1.default({
                userId,
                items: [{ product: productId, quantity }]
            });
        }
        else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ product: productId, quantity });
            }
        }
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        console.error("Add to cart error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.addToCart = addToCart;
/* =====================
   Remove from Cart
===================== */
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;
        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }
        const cart = await cart_model_1.default.findOneAndUpdate({ userId }, { $pull: { items: { product: productId } } }, { new: true });
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }
        res.status(200).json(cart);
    }
    catch (error) {
        console.error("Remove from cart error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.removeFromCart = removeFromCart;
/* =====================
   Get Cart
===================== */
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cart_model_1.default.findOne({ userId }).populate("items.product");
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getCart = getCart;
/* =====================
   Decrease Quantity
===================== */
const decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;
        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }
        const cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            res.status(404).json({ error: "Product not in cart" });
            return;
        }
        cart.items[itemIndex].quantity -= 1;
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        console.error("Decrease quantity error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.decreaseQuantity = decreaseQuantity;
