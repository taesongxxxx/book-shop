import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const join = async (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(64).toString("base64");
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

  try {
    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, hashPassword, salt];

    const [results] = await conn.query(sql, values);

    return res.status(StatusCodes.CREATED).json(results);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const login = async (req, res) => {
  const {email, password} = req.body

  try {
    const sql = "SELECT * FROM users WHERE email = ? ";
    const [results] = await conn.query(sql, email);
    const loginUser = results[0];

    if (!loginUser) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "이메일 또는 비밀번호가 일치하지 않습니다."
      });
    }

    const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 64, "sha512").toString("base64");

    if (loginUser.password == hashPassword) {
      const token = jwt.sign({
        email: loginUser.email
      }, process.env.PRIVATE_KEY, {
        expiresIn: "5m",
        issuer: "taeseong"
      });

      res.cookie("token", token, {
        httpOnly: true
      });
      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    }
    
    else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "이메일 또는 비밀번호가 일치하지 않습니다."
      })
    }

  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

};

const passwordResetRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";

    const [results] = await conn.query(sql, email);

    const user = results[0]

    if (user) {
      return res.status(StatusCodes.OK).json({
        email : email
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }

  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const passwordReset = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const values = [hashPassword, salt, email]

    const [results] = await conn.query(sql, values);

    if (results.affectedRows) {
      return res.status(StatusCodes.OK).json(results);
    }

    else {
      return res.status(StatusCodes.BAD_REQUEST).end()
    }

  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export { join, login, passwordResetRequest, passwordReset };
