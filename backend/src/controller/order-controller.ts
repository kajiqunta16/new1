import { Request, Response } from "express";
import Order, { OrderStatus } from "../models/order-model";

/* =====================
   Create Order
===================== */

export const createOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, products, totalAmount, status } = req.body;

        const order = new Order({
            userId,
            products,
            totalAmount,
            status
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Get User Orders
===================== */

export const getUserOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Update Order Status
===================== */

export const updateOrderStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { status } = req.body as { status: OrderStatus };
        const { orderId } = req.params;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

/* =====================
   Delete Order
===================== */

export const deleteOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
