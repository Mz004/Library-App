const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//register new user
async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Login user
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { _id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Get user's favourite
async function getUserFavorites(req, res) {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//add user favourite
async function addFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.favorites.includes(req.params.id)) {
      user.favorites.push(req.params.id);
      await user.save();
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.favorites.pull(req.params.id);
    await user.save();
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserHistory(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addHistory(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { route } = req.body;
    user.history.push({ route });
    await user.save();
    res.status(200).json({ history: user.history, message: 'Route added to history' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeHistory(req, res) {
  try {
    const { routeId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { history: { _id: routeId } } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Route removed from history', history: user.history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeAllHistory(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { history: [] } }, // Clear the history array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'All history removed', history: user.history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserHistory,
  addHistory,
  removeHistory,
  removeAllHistory
};
