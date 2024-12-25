const express = require('express');
const router = express.Router();
const Movie = require('./models');
const userAuth = require('./user');
const bcrypt = require('bcrypt');

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

// Render Register Page
router.get('/register', (req, res) => {
  res.render('register');  // Render register.ejs
});

// Handle Register Logic
router.post('/register', async (req, res) => {
  try {
    console.log(req.body); // Log the request body to check form submission

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required!' });
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(password, 12);

    // Create a new user and save it
    const user = new userAuth({
      username, password: hash
    });

    await user.save();

    // Set session after successful registration
    req.session.user_id = user._id;

    res.redirect('/'); // Redirect to home or dashboard after registration
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send({ message: 'Failed to register user' });
  }
});

// Render Login Page
router.get('/login', (req, res) => {
  res.render('login');  // Render login.ejs
});

// Handle Login Logic
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userAuth.findOne({ username });

    if (!user) {
      return res.status(400).send({ message: 'User not found!' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      req.session.user_id = user._id;
      res.redirect('/secret');  // Redirect to the secret page if login is successful
    } else {
      res.status(400).send({ message: 'Invalid password!' });  // Handle incorrect password
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({ message: 'Failed to login' });
  }
});

// Logout User
router.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/');  // Redirect to the home page after logout
});

// Render Secret Page
router.get('/secret', (req, res) => {
  if (req.session.user_id) {
    res.render('secret');  // Render secret.ejs if authenticated
  } else {
    res.redirect('/login');  // Redirect to login if not authenticated
  }
});

module.exports = router;
