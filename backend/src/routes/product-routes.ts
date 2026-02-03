import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from "../controller/product-controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.put("/:productId", updateProductById);
router.delete("/:productId", deleteProductById);

export default router;
