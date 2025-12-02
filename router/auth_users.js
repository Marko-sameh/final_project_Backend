const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// -------- Helper Functions --------

// Check if username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check if username + password match existing record
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// -------- Task 7: Login User --------
// Endpoint: POST /customer/login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check missing fields
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Validate credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Generate JWT token
  let accessToken = jwt.sign(
    { username: username },
    "access", // JWT secret
    { expiresIn: "1h" }
  );

  // Save session token
  req.session.authorization = { accessToken, username };

  return res
    .status(200)
    .json({ message: "Login successful!", token: accessToken });
});

// -------- Task 8: Add or Modify Review --------
// Endpoint: PUT /customer/auth/review/:isbn
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Initialize reviews if not exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review under username
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// -------- Task 9: Delete Review --------
// Endpoint: DELETE /customer/auth/review/:isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

// Export modules
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
