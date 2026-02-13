import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import categoryRouter from "./routes/category.js";
import likeRouter from "./routes/likes.js";
import cartRouter from "./routes/carts.js";
import orderRouter from "./routes/orders.js";


const app = express();
dotenv.config()

app.listen(process.env.PORT);

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);