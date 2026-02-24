import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

// (카테고리 별, 신간 여부) 전체 도서 목록 조회
const allBooks = async (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;

  // limit : page 당 도서 수
  // currentPage : 현재 몇 페이지
  // offset: limit * (currentPage-1)
  let offset = limit * (currentPage - 1);

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
  let values = [];

  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(category_id);
  } else if (category_id) {
    sql = sql + " WHERE category_id = ?";
    values.push(category_id);
  } else if (news) {
    sql =
      sql +
      " WHERE pub_date BETWEEN DATE_SUB(NOW() , INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

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

const bookDetail = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const sql = `SELECT *,
	                (SELECT count(*) FROM likes WHERE liked_book_id = books.id ) AS likes,
	                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
	                FROM books LEFT JOIN category 
                  ON books.category_id = category.category_id WHERE books.id = ?`;
    let values = [user_id, id, id];
    const [results] = await conn.query(sql, values);
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

export { allBooks, bookDetail };
