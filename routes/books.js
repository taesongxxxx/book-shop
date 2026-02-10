import express from "express";
const router = express.Router();
router.use(express.json())

// 전체 도서 조회
router.get("/", async (req, res) => {
  res.json("전체 도서 조회");
});

// 개별 도서 조회
router.get("/:bookId", async (req, res) => {
  res.json("개별 도서 조회");
});

// 카테고리별 도서 조회
router.get("/", async (req, res) => {
  res.json("카테고리별 도서 조회");
});

export default router
