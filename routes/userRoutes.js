const express = require('express');
const router = express.Router();
const passport = require('../middleware/authentication');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/favorites', passport.authenticate('jwt', { session: false }), userController.getUserFavorites);
router.put('/favorites/:id', passport.authenticate('jwt', { session: false }), userController.addFavorite);
router.delete('/favorites/:id', passport.authenticate('jwt', { session: false }), userController.removeFavorite);

router.get('/history', passport.authenticate('jwt', { session: false }), userController.getUserHistory);
router.post('/history', passport.authenticate('jwt', { session: false }), userController.addHistory);
router.delete('/history/:routeId', passport.authenticate('jwt', { session: false }), userController.removeHistory);

module.exports = router;
