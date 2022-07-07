var express = require("express");
var router = express.Router();
const asyncHandler = require("express-async-handler");
var createError = require("http-errors");

// Import Book model
var Book = require("../models").Book;

// GET home page - redirects to /books route
router.get("/", asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

// Show full list of books
router.get("/books", asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "Books" });
  })
);

// Show create new book form
router.get("/books/new", asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

// Post new book to database
router.post("/books/new", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {

      // If required fields fail validation, re-render form from properties/values... 
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body); // ...from non-persistent model created by req.body...
        res.render("new-book", {
          book,
          title: "New Book",
          errors: error.errors, // ...and display errors passed to view file
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block 
      }
    }
  })
);

// Show book detail form
router.get("/books/:id", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update book" });
    } else {
      throw createError(404, "Sorry, that page was not found. Please check the URL.");
    }
  })
);

// Updates book info in the database
router.post("/books/:id", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/");
      } else {
        throw createError(404, "Sorry, that page was not found. Please check the URL.");
      }
    } catch (error) {

      // If validation is failed, will re-render form using properties/values... 
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body); // ...from non-persistent model instance....
        book.id = req.params.id; // makes sure correct book gets updated
        res.render("update-book", {
          book,
          title: "Update Book",
          errors: error.errors, // ...passing in errors to display
        });
      } else {
        throw error;
      }
    }
  })
);

// Deletes a book
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books/");
    } else { 
      throw createError(500, "Sorry, that was a problem retrieving that book.");
    }
  })
);

module.exports = router;

