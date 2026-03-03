import express from "express";
import { order, getOrders, getOrderDetail } from "../controller/OrderController.js"

const router = express.Router();
router.use(express.json())

// 결제하기
router.post("/", order);

// 주문 목록 조회
router.get("/", getOrders);

// 주문 상세 상품 조회
router.get("/:id", getOrderDetail);

export default router
