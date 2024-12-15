const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const movieRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://attash2312:admin112233@cluster0.vdmn8.mongodb.net/movielist?retryWrites=true&w=majority';

app.use(cookieParser());
app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 5 }, // 5 minutes
  })
);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Use routes
app.use('/api', movieRoutes);

// Default route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to Movie Watchlist Backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
