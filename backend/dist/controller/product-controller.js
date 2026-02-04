"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product-model"));
/* =====================
   Create Product
===================== */
const createProduct = async (req, res) => {
    try {
        const { image, category, name, short_description, description, price, list_price } = req.body;
        const product = new product_model_1.default({
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
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.createProduct = createProduct;
/* =====================
   Get All Products
===================== */
const getAllProducts = async (req, res) => {
    try {
        const products = await product_model_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getAllProducts = getAllProducts;
/* =====================
   Get Product By ID
===================== */
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Invalid product ID"
        });
    }
};
exports.getProductById = getProductById;
/* =====================
   Update Product
===================== */
const updateProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await product_model_1.default.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Update failed"
        });
    }
};
exports.updateProductById = updateProductById;
/* =====================
   Delete Product
===================== */
const deleteProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await product_model_1.default.findByIdAndDelete(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Delete failed"
        });
    }
};
exports.deleteProductById = deleteProductById;
