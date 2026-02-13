import express from "express";
import { allCategory } from "../controller/CategoryController.js";
const router = express.Router();
router.use(express.json())

// 카테고리 전체 목록 조회
router.get("/", allCategory);



export default router
