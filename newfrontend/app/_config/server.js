const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: process.env.NEXT_PUBLIC_MYSQL_USER,
  host: process.env.NEXT_PUBLIC_MYSQL_HOST,
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
});

app.post("/register", (req, res) => {

    const { fName, lName, email, password } = req.body;

  db.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)",
    [fName, lName, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering user" });
      } else {
        res.status(200).json({ message: "User registered successfully" })
      }
    }
  );
});

app.post("/login", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Wrong username or password!" });
      }
    }
  );
});

app.listen(3306, () => {
  console.log("Running server...");
});
