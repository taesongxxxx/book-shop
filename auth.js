import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
dotenv.config();


const ensureAuthorization = (req, res) => {
  try {
    let receivedJwt = req.headers["authorization"];
    
    if (!receivedJwt) {
        throw new ReferenceError("jwt must be provided");
    }

    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decodedJwt;
  } catch (err) {
    console.error(err.name, err.message);

    if (err instanceof jwt.TokenExpiredError) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 토큰입니다.",
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인이 필요합니다.",
      });
    }
    return null; 
  }
};

export { ensureAuthorization }; 