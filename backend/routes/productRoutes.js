import expres from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = expres.Router();

router.get("/", getProducts); //fetch all the products
router.get("/:id", getProduct); //get a prod
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;