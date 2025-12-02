// const express = require("express");
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();

// // ---------- Task 6: Register New User ----------
// public_users.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   // Validate input
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required" });
//   }

//   // Check if user already exists
//   const userExists =
//     users.filter((user) => user.username === username).length > 0;
//   if (userExists) {
//     return res.status(409).json({ message: "User already exists" });
//   }

//   // Register user
//   users.push({ username: username, password: password });
//   return res.status(200).json({ message: "User registered successfully!" });
// });

// // ---------- Task 1: Get all books ----------
// public_users.get("/", (req, res) => {
//   return res.status(200).json(JSON.stringify(books, null, 2));
// });

// // ---------- Task 2: Get books based on ISBN ----------
// public_users.get("/isbn/:isbn", (req, res) => {
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// // ---------- Task 3: Get books by Author ----------
// public_users.get("/author/:author", (req, res) => {
//   const author = req.params.author;
//   let filteredBooks = [];

//   Object.keys(books).forEach((key) => {
//     if (books[key].author.toLowerCase() === author.toLowerCase()) {
//       filteredBooks.push(books[key]);
//     }
//   });

//   if (filteredBooks.length > 0) {
//     return res.status(200).json(filteredBooks);
//   } else {
//     return res.status(404).json({ message: "No books found by that author" });
//   }
// });

// // ---------- Task 4: Get books by Title ----------
// public_users.get("/title/:title", (req, res) => {
//   const title = req.params.title;
//   let filteredBooks = [];

//   Object.keys(books).forEach((key) => {
//     if (books[key].title.toLowerCase() === title.toLowerCase()) {
//       filteredBooks.push(books[key]);
//     }
//   });

//   if (filteredBooks.length > 0) {
//     return res.status(200).json(filteredBooks);
//   } else {
//     return res.status(404).json({ message: "No books found with that title" });
//   }
// });

// // ---------- Task 5: Get book reviews ----------
// public_users.get("/review/:isbn", (req, res) => {
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     return res.status(200).json(book.reviews);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// module.exports.general = public_users;

const express = require("express");
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require("axios");

// ---------- Task 10: Get All Books using Axios ----------
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/"); 
    return res.status(200).json({
      message: "Axios: All books fetched successfully",
      data: response.data,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching books via Axios" });
  }
});

// ---------- Task 11: Get Book by ISBN using Axios ----------
public_users.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json({
      message: "Axios: Book fetched successfully by ISBN",
      data: response.data,
    });
  } catch (err) {
    return res.status(404).json({ error: "Book not found via Axios" });
  }
});

// ---------- Task 12: Get Books by Author using Axios ----------
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json({
      message: "Axios: Books fetched successfully by author",
      data: response.data,
    });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "No books found for this author via Axios" });
  }
});

// ---------- Task 13: Get Books by Title using Axios ----------
public_users.get("/async/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json({
      message: "Axios: Books fetched successfully by title",
      data: response.data,
    });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "No books found with this title via Axios" });
  }
});

module.exports.general = public_users;
