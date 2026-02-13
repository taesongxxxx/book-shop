import express from "express";
import { allBooks, bookDetail } from "../controller/BookController.js";
const router = express.Router();
router.use(express.json())

// 전체 도서 조회, 카테고리별 도서 조회
router.get("/", allBooks);

// 개별 도서 조회
router.get("/:id", bookDetail);

export default router
