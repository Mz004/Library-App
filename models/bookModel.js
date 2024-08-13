const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn13: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{13}$/.test(v);
      },
      message: props => `${props.value} is not a valid ISBN-13!`
    }
  },
  isbn10: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid ISBN-10!`
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  authors: {
    type: String,
    trim: true
  },
  categories: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  published_year: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not a valid year!`
    }
  },
  average_rating: {
    type: Number,
    min: 0,
    max: 5,
    validate: {
      validator: function(v) {
        return v === null || (v >= 0 && v <= 5);
      },
      message: props => `${props.value} is not a valid rating!`
    }
  },
  num_pages: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not a valid number of pages!`
    }
  },
  ratings_count: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not a valid ratings count!`
    }
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 1 });
bookSchema.index({ authors: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
