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

// import routes
const forumRouter = require('./routes/forum');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');


// import database
const User = require('./models/userModel');
const Reply = require('./models/replyModel');
const Post = require('./models/postModel');
const Board = require('./models/boardModel');
const Category = require('./models/categoryModel');

// initialize database
const populate = require('./database/initdb');

// render homepage
app.get('/', async (req, res) => {
      try {
            // Fetch data from the database
            const { categories, boards, posts, users } = await populate();
    
            // Render the homepage with the fetched data
            res.render('index', { categories: categories, boards: boards, posts: posts, users: users });
      } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
      }
})

// use routes
app.use('/forum', forumRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


// error handling 
app.use((req, res) => {
      res.status(404).send('Page not found');
});


// server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})