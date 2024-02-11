// require important modules
const express = require('express');
const dotenv = require('dotenv').config();
const database = require('./database/database');

// config 
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// connect to database
database();

// import routers
const forumRouter = require('./routes/forum');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const searchRouter = require('./routes/search');

// initialize database
const populate = require('./database/initdb');

// render homepage
app.get('/', populate, (req, res) => {
      try {
            // Render the homepage with the fetched data
            res.render('index', { loggedIn: false, categories: res.categories, 
                  boards: res.boards, posts: res.posts, users: res.users });
      } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ message: err.message });
      }
})

// use routes
app.use('/forum', forumRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);

// server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})