const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



// import routes
const forumRouter = require('./routes/forum');
const postRouter = require('./routes/post');
const profileRouter = require('./routes/profile');


// import mock database
const mockDatabase = require('./mockDB');
const boards = mockDatabase.boards;
const posts = mockDatabase.posts;
const users = mockDatabase.users;


// render homepage
app.get('/', (req, res) => {
      console.log(mockDatabase);
      console.log(mockDatabase.boards);
      res.render('index', { title: 'NexusHub', boards: boards, posts: posts, users: users });
})

// use routes
app.use('/forum', forumRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);


// error handling 
app.use((req, res) => {
      res.status(404).send('Page not found');
});


// server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})