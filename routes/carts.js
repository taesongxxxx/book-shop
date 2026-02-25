import express from "express";
import { addToCart, getCartItems, removeCartItem } from "../controller/CartController.js";
const router = express.Router();
router.use(express.json())

// 장바구니 담기
router.post("/", addToCart);

// 장바구니 아이템 목록 조회
router.get("/", getCartItems);

// 장바구니 아이템 삭제
router.delete("/:id", removeCartItem);

export default router
