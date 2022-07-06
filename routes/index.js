var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
var createError = require('http-errors');

// Imports Book model
var {Book} = require('../models');

// GET home page.
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books');
}));

// Show full list of books
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Books" });
}));

// Show create new book form

router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {book: {}, title: "New Book" });
}));

// Post new book to database
router.post('/books/new', asyncHandler(async(req, res, next) => {
  let book;
  try { 
    book = await Book.create(req.body);
    res.redirect('/');
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', {book, title: "New Book", errors: error.errors});
    } else {
      throw error;
    }
  }

}));

// Show book detail form 

router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', {book, title: "Update book"});
  } else {
    throw createError(404, "Sorry, that page doesn't exist.")
  }
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async(req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/');
    } else {
      throw createError(404, "Sorry, that page doesn't exist.")
    }
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, title: "Update Book", errors: error.errors});
    } else {
      throw error;
    }
  }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books/');
  } else {
    throw createError(500, "Sorry, that was a problem retrieving that.")
  }
  
}));

// Deletes a book






module.exports = router;


/* 
TODO: 
-FIX ERROR HANDLING
*/