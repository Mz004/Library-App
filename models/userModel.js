const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
  history: [historySchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
