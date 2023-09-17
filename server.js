const express = require("express");
const app = express();
const PORT = 3000;

let movementType = undefined;
let currentType = undefined;

app.use(express.json());
// app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      json: (context) => JSON.stringify(context),
    },
  })
);

app.set("view engine", "hbs");

const LIMP_TIME_THRESHOLD = 3000; // Time threshold
const AMPLITUDE_THRESHOLD = 1.4; // New threshold for acceleration amplitude to determine limping

// let yAcceleration = [];
let lastThresholdTime = null;

function breakThreshold(value) {
  if (value > AMPLITUDE_THRESHOLD) {
    lastThresholdTime = Date.now();
    return true;
  }
  return false;
}

function detectLimping() {
  if (!lastThresholdTime) return "No Threshold Break";

  let timeSinceLastBreak = Date.now() - lastThresholdTime;

  if (timeSinceLastBreak > LIMP_TIME_THRESHOLD) {
    return false; //limping
  } else {
    return true; //walking
  }
}

app.get("/", (req, res) => {
  res.render("main", { movement: movementType, layout: false });
  // if (currentType != movementType) {
  //   location.reload();
  // }
});

app.post("/data", (req, res) => {
  console.log(req.body);

  if (breakThreshold(req.body.y)) {
    console.log("Threshold Broke!");
  }
  currentType = movementType;
  movementType = detectLimping();
  console.log(`Movement Type: ${movementType}`);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
