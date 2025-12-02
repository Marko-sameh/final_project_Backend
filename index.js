const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
app.use(express.json());

/* ---------------- SESSION MIDDLEWARE ---------------- */
app.use(
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true,
  })
);

/* --------------- SECRET KEY FOR JWT ----------------- */
const SECRET_KEY = "access";

/* ------------------ AUTH MIDDLEWARE ------------------ */
app.use("/customer/auth/*", (req, res, next) => {
  // Token must be sent as:  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Invalid authorization format" });

  const token = parts[1];

  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.session.authorization = { username: decodedUser.username };

    next();
  });
});

/* ------------------- ROUTES MOUNT -------------------- */
app.use("/customer", customer_routes);
app.use("/", genl_routes);

/* ------------------- START SERVER -------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
