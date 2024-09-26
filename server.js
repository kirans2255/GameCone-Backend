require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


// const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to parse JSON bodies  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

const userRoutes = require('./routes/user');
app.use('/', userRoutes);

connectDB();

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
