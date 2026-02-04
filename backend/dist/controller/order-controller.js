"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getUserOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order-model"));
/* =====================
   Create Order
===================== */
const createOrder = async (req, res) => {
    try {
        const { userId, products, totalAmount, status } = req.body;
        const order = new order_model_1.default({
            userId,
            products,
            totalAmount,
            status
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.createOrder = createOrder;
/* =====================
   Get User Orders
===================== */
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await order_model_1.default.find({ userId });
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getUserOrders = getUserOrders;
/* =====================
   Update Order Status
===================== */
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;
        const order = await order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
/* =====================
   Delete Order
===================== */
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await order_model_1.default.findByIdAndDelete(orderId);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json({ message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.deleteOrder = deleteOrder;
