import { Request, Response } from "express";
import Cart, { ICart } from "../models/cart-model";

/* =====================
   Add to Cart
===================== */

export const addToCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId, quantity } = req.body;
        const { userId } = req.params;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Remove from Cart
===================== */

export const removeFromCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        );

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Get Cart
===================== */

export const getCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate("items.product");

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Decrease Quantity
===================== */

export const decreaseQuantity = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

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
    } catch (error) {
        console.error("Decrease quantity error:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
