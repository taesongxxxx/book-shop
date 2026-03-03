import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

const order = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

  try {
    // 1. 배송 정보 입력 (Delivery Insert)
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    
    const [deliveryResults] = await conn.query(sql, values);
    const delivery_id = deliveryResults.insertId; // 생성된 delivery_id 저장

    // 2. 주문 정보 입력 (Orders Insert)
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
           VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    const [orderResults] = await conn.query(sql, values);
    const order_id = orderResults.insertId; // 생성된 order_id 저장

    // itmes를 가지고, 장바구니에서 book_id, quantitiy 조회
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, field] = await conn.query(sql, [items]);

    // 3. 주문 상세 목록 입력 (OrderedBook Bulk Insert)
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) => {
      values.push([order_id, item.book_id, item.quantity]);
    });

    let [results] = await conn.query(sql, [values]);

    sql = `DELETE FROM cartItems WHERE id IN (?)`;

    [results] = await conn.query(sql, [items]);

    // 모든 과정이 성공적으로 끝난 후 여기서 딱 한 번만 응답 전송
    return res.status(StatusCodes.CREATED).json(results);

  } catch (err) {
    console.error(err);
    // 중간에 에러가 나면 여기서 처리
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const getOrders = async (req, res) => {

  let sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at,
              address, receiver, contact
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id = delivery.id;`
  try {
    const [results] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  
  let sql = `SELECT book_id, title, author, price, quantity
              FROM orderedBook LEFT JOIN books
              ON orderedBook.book_id = books.id
              WHERE order_id = ?;`
  try {
    const [results] = await conn.query(sql, [id]);
    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export { order, getOrders, getOrderDetail };
