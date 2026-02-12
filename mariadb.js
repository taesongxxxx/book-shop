import mariadb from "mysql2/promise";

const connection = await mariadb.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Bookshop",
  dateStrings: true
});

export default connection