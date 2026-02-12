import express from "express";
import {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} from "../controller/UserController.js";
const router = express.Router();
router.use(express.json());

router.post("/join", join);
router.post("/login", login);
router.post("/reset", passwordResetRequest);
router.put("/reset", passwordReset);

export default router;
