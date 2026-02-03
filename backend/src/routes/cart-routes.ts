import { Router } from "express";
import { addToCart, removeFromCart, getCart, decreaseQuantity } from "../controller/cart-controller";

const router = Router();

router.post("/:userId/add", addToCart);
router.delete("/:userId/remove", removeFromCart);
router.get("/:userId", getCart);
router.put("/:userId/decrease", decreaseQuantity);

export default router;