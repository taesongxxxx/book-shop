import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

const allCategory = async (req, res) => {
  try {
    const sql = "SELECT * FROM category";
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

export { allCategory };
