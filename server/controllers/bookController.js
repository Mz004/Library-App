const Book = require('../models/bookModel');

// retrieve books data
async function getBooks(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  try {
    const books = await Book.find().sort({ isbn13: 'asc' }).limit(limit).skip(skip).exec();
    const count = await Book.countDocuments();
    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books,
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Error fetching books');
  }
}

//find book by isbn13
async function getBookByIsbn(isbn13) {
  try {
    const book = await Book.findOne({ isbn13 });
    if (!book) {
      throw new Error(`Book not found with ISBN-13: ${isbn13}`);
    }
    return book;
  } catch (error) {
    console.error('Error getting book by ISBN-13:', error);
    throw new Error('Could not fetch the book');
  }
}

//find book by title, author and category
async function searchBooks({ title, author, category }, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const query = {};

  if (title) query.title = new RegExp(title, 'i');
  if (author) query.authors = new RegExp(author, 'i');
  if (category) query.categories = new RegExp(category, 'i');

  try {
    const books = await Book.find(query).limit(limit).skip(skip).exec();
    const count = await Book.countDocuments(query);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books,
    };
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Error searching books');
  }
}

//add book
async function addBook(bookData) {
  try {
    const newBook = new Book(bookData);
    await newBook.save();
    return newBook;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error('Error adding book');
  }
}

//edit book
async function updateBook(isbn13, bookData) {
  try {
    const updatedBook = await Book.findOneAndUpdate({ isbn13 }, bookData, { new: true });
    if (!updatedBook) {
      throw new Error('Book not found');
    }
    return updatedBook;
  } catch (error) {
    console.error(`Error updating book with ISBN-13 ${isbn13}:`, error);
    throw new Error('Error updating book');
  }
}

//delete book
async function deleteBook(isbn13) {
  try {
    const deletedBook = await Book.findOneAndDelete({ isbn13 });
    if (!deletedBook) {
      throw new Error('Book not found');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting book with ISBN-13 ${isbn13}:`, error);
    throw new Error('Error deleting book');
  }
}

module.exports = {
  getBooks,
  getBookByIsbn,
  searchBooks,
  addBook,
  updateBook,
  deleteBook,
};
