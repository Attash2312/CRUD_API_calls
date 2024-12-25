const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const movieRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path'); // Required for setting views path

const app = express();
const port = 5000;

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://attash2312:admin112233@cluster0.vdmn8.mongodb.net/movielist?retryWrites=true&w=majority';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views folder is correctly specified

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form bodies
app.use(cors());
app.use(cookieParser());

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false,
  },
}));

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Use routes
app.use('/', movieRoutes);

// View count using sessions
app.get('/view-count', (req, res) => {
  if (!req.session.views) req.session.views = 0;
  req.session.views++;
  res.send(`You have visited this page ${req.session.views} times.`);
});

// Check cookies
app.get('/get-cookies', (req, res) => {
  // Get session data and cookie values
  const sessionData = req.session.user || 'No session data found';
  const visited = req.session.viewCount || 0; // Check the view count from session
  const cookieData = req.cookies.testCookie || 'No cookie found'; // Getting cookie data
  res.status(200).json({
    session: sessionData,
    visitedCount: visited,
    cookie: cookieData,
  });
});

// Set a test cookie and session
app.get('/set-cookie', (req, res) => {
  // Set cookie and session data
  res.cookie('testCookie', 'cookieValue', { maxAge: 1000 * 60 * 60, httpOnly: true });
  req.session.user = { name: 'John Doe', role: 'Student' }; // Set some session data
  res.json({ message: 'Cookie and session set!' });
});

// Destroy session cookies
app.get('/destroy-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Failed to destroy session');
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.clearCookie('testCookie'); // Clear the testCookie as well
    res.send('Session and cookies destroyed successfully.');
  });
});


// Check Admin Access using Query Parameter
app.get('/isAdmin', (req, res) => {
  if (req.query.isAdmin === 'true') {
    res.send('Welcome Admin');
  } else {
    res.status(403).send('Not an Admin');
  }
});

// Default route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to Movie Watchlist Backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
