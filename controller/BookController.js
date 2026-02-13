import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

const allBooks = async (req, res) => {
  const { category_id } = req.query;
  if (category_id) {
    try {
      const sql = "SELECT * FROM books WHERE category_id = ?";
      const [results] = await conn.query(sql, [category_id]);
      if (results.length) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  } else {
    try {
      const sql = "SELECT * FROM books";
      const [results] = await conn.query(sql);
      if (results.length) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  }
};

const bookDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM books WHERE id = ?";
    const [results] = await conn.query(sql, [id]);
    if (results.length) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};


export { allBooks, bookDetail};
