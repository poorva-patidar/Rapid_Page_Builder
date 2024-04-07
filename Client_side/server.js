const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("public/html"));

app.get("/*", async (req, res) => {
  const response = await fetch("http://localhost:3030/blog" + req.originalUrl);
  const data = await response.text();
  res.send(data);
});

app.listen(5000, () => {
  console.log("Server is running on port: 5000");
});