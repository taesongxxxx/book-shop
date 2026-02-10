import express from "express";
const router = express.Router();
router.use(express.json())

// 결제하기
router.post("/", async (req, res) => {
  res.json("결제하기");
});

// 주문 목록 조회
router.get("/", async (req, res) => {
  res.json("주문 목록 조회");
});

// 주문 상세 상품 조회
router.get("/:orderId", async (req, res) => {
  res.json("주문 상세 상품 조회");
});

export default router
