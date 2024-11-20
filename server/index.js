const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const server = express();
const port = 5000;

server.use(cors());
server.use(bodyParser.json());

/// Toplama işlemi (GET isteği ile)
server.get("/add", (req, res) => {
  const { num1, num2 } = req.query; // num2'yi al


  const result = Number(num1) + Number(num2);

  res.json({ result });
});
server.get("/multiply", (req, res) => {
  const { num1, num2 } = req.query; // num1 ve num2'yi al

  const result = Number(num1) * Number(num2); // Çarpma işlemi

  res.json({ result });
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
