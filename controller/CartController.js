import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

const addToCart = async (req, res) => {
  const { book_id, quantity, user_id } = req.body;

  let sql =
    "INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)";
  let values = [user_id, book_id, quantity];

  try {
    const [result] = await conn.query(sql, values);
    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).json({ cart_id: result.insertId });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const getCartItems = async (req, res) => {
  const { user_id, selected } = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
   FROM cartItems LEFT JOIN books 
   ON cartItems.book_id = books.id 
   WHERE user_id = ? AND cartItems.id IN (?)`;

  let values = [user_id, selected];

  try {
    const [results] = await conn.query(sql, values);
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const removeCartItem = async (req, res) => {
  const { id } = req.params;

  let sql = "DELETE FROM cartItems WHERE id = ?";
  let values = [id];
  try {
    const [result] = await conn.query(sql, values);
    if (result.affectedRows) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "장바구니 아이템이 삭제되었습니다." });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "장바구니 아이템을 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export { addToCart, getCartItems, removeCartItem };
