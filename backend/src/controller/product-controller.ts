import { Request, Response } from "express";
import Product from "../models/product-model";

/* =====================
   Create Product
===================== */

export const createProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            image,
            category,
            name,
            short_description,
            description,
            price,
            list_price
        } = req.body;

        const product = new Product({
            image,
            category,
            name,
            short_description,
            description,
            price,
            list_price
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Get All Products
===================== */

export const getAllProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Get Product By ID
===================== */

export const getProductById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Invalid product ID"
        });
    }
};

/* =====================
   Update Product
===================== */

export const updateProductById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Update failed"
        });
    }
};

/* =====================
   Delete Product
===================== */

export const deleteProductById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Delete failed"
        });
    }
};
