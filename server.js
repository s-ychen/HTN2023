const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/data", (req, res) => {
  console.log(req.body);
  res.send("Data received");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
