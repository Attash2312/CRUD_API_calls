const express = require('express');
const router = express.Router();
const Movie = require('./models');

// CRUD operations for Movies
router.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.post('/movies', async (req, res) => {
  const { name, genre, year } = req.body;
  const movie = new Movie({ name, genre, year });
  await movie.save();
  res.send({ message: 'Movie added successfully!' });
});

router.put('/movies/:id', async (req, res) => {
  const { name, genre, year } = req.body;
  const movie = await Movie.findByIdAndUpdate(req.params.id, { name, genre, year }, { new: true });
  res.send({ message: 'Movie updated successfully!', movie });
});

router.delete('/movies/:id', async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.send({ message: 'Movie deleted successfully!' });
});

// View count using sessions
router.get('/view-count', (req, res) => {
  if (!req.session.views) req.session.views = 0;
  req.session.views++;
  res.send(`You have visited this page ${req.session.views} times.`);
});

// Check cookies
router.get('/check-cookies', (req, res) => {
  const cookieValue = req.cookies.testCookie || 'No cookie set';
  res.send(`Cookie value: ${cookieValue}`);
});

// Set a test cookie
router.get('/set-cookie', (req, res) => {
  res.cookie('testCookie', 'CookieSetValue', { maxAge: 60000 }); // 1 minute
  res.send('Test cookie set.');
});

// Check Admin Access using Query Parameter
router.get('/isAdmin', (req, res) => {
  if (req.query.isAdmin === 'true') {
    res.send('Welcome Admin');
  } else {
    res.status(403).send('Not an Admin');
  }
});

// Destroy session
router.get('/destroy-session', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Failed to destroy session');
    res.clearCookie('connect.sid');
    res.send('Session destroyed successfully.');
  });
});

module.exports = router;
