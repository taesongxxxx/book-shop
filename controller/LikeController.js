import { ensureAuthorization } from "../auth.js";
import conn from "../mariadb.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

const addLike = async (req, res) => {
  const { id } = req.params;

  let decodedJwt = ensureAuthorization(req, res);
  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)"; 
  let values = [decodedJwt.id, id];

  try {
    const [results] = await conn.query(sql, values);
    if (results.affectedRows) {
      return res.status(StatusCodes.CREATED).json({ message: "좋아요 추가 성공" });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "좋아요 추가 실패" });
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "좋아요 추가 중 오류 발생" });
  }
}

const removeLike = async (req, res) => {
  const { id } = req.params;

  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  let values = [decodedJwt.id, id];
  
  try {
    const [results] = await conn.query(sql, values);
    if (results.affectedRows) {
      return res.status(StatusCodes.OK).json({ message: "좋아요 삭제 성공" });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "좋아요 삭제 실패" });
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "좋아요 삭제 중 오류 발생" });
  }
}

export { addLike, removeLike };