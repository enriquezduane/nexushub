// require important modules
const express = require('express');
const dotenv = require('dotenv').config();
const connectDatabase = require('./models/database/database');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// config 
const app = express();
const port = process.env.PORT;

// static file serving
app.use(express.static('public'));

// middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/default')

// connect to database
connectDatabase();

// import routers
const indexRouter = require('./routes/index');
const forumRouter = require('./routes/forum');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const searchRouter = require('./routes/search');
const adminRouter = require('./routes/admin');

// use routes to handle requests
app.use('/', indexRouter)
app.use('/forum', forumRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);

// server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})