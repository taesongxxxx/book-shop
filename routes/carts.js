import express from "express";
const router = express.Router();
router.use(express.json())

// 장바구니 담기
router.post("/", async (req, res) => {
  res.json("장바구니 담기");
});

// 장바구니 조회
router.get("/", async (req, res) => {
  res.json("장바구니 담기");
});

// 장바구니 제거
router.delete("/:bookId", async (req, res) => {
  res.json("장바구니 제거");
});

// 장바구니에서 선택한 주문 예상 상품 목록 조회
router.get("/", async (req, res) => {
  res.json("장바구니에서 선택한 주문 예상 상품 목록 조회");
});

export default router
