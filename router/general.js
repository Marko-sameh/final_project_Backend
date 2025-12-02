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

// ---------- Task 10: Get All Books using Async/Await ----------
public_users.get("/async/books", async (req, res) => {
  try {
    // Simulate async operation (DB fetch)
    const allBooks = await Promise.resolve(books);
    return res.status(200).json({
      message: "Async-Await: All books fetched successfully",
      data: allBooks,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching books" });
  }
});

// ---------- Task 11: Get Book by ISBN using Promises ----------
public_users.get("/async/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject();
  })
    .then((book) => {
      return res.status(200).json({
        message: "Promise: Book fetched successfully by ISBN",
        data: book,
      });
    })
    .catch(() => {
      return res.status(404).json({ error: "Book not found" });
    });
});

// ---------- Task 12: Get Books by Author using Async/Await ----------
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();

  try {
    const result = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    return res.status(200).json({
      message: "Async-Await: Books fetched successfully by author",
      data: result,
    });
  } catch {
    return res.status(500).json({ error: "Error fetching books" });
  }
});

// ---------- Task 13: Get Books by Title using Promises ----------
public_users.get("/async/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title
    );

    result.length ? resolve(result) : reject();
  })
    .then((books) => {
      return res.status(200).json({
        message: "Promise: Books fetched successfully by title",
        data: books,
      });
    })
    .catch(() => {
      return res.status(404).json({ error: "No books found with this title" });
    });
});

module.exports.general = public_users;
