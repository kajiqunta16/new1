import { Router } from "express";
import { createOrder, getUserOrders, updateOrderStatus, deleteOrder } from "../controller/order-controller";

const router = Router();

router.post("/", createOrder);
router.get("/:userId", getUserOrders);
router.put("/:orderId/status", updateOrderStatus);
router.delete("/:orderId", deleteOrder);

export default router;
