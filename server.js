// load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// require important modules
const express = require('express');
const connectDatabase = require('./models/database/database');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cron = require('node-cron');
const { checkIfBanned, verifyRememberMeToken, trackActivity, deleteOldActivities, resetMostOnlineToday } = require('./controllers/helper');

// config 
const app = express(); 
const port = process.env.PORT;

// cron job to delete old activities
cron.schedule('*/5 * * * *', async () => {
  try {
      await deleteOldActivities();
  } catch (err) {
      console.error('Error running scheduled reset:', err);
  }
});

// cron job to reset most online today count
cron.schedule('0 0 * * *', async () => {
  try {
    await resetMostOnlineToday();
  } catch (err) {
    console.error('Error running scheduled reset:', err);
  }
});

// passport and session initialization
const initializePassport = require('./controllers/passportConfig');
initializePassport(passport);

app.use(flash());

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

// static file serving
app.use(express.static('public'));

// middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/default')

// connect to database
connectDatabase();

// check if user is banned
app.use(checkIfBanned);

// remember me functionality
app.use(verifyRememberMeToken);

// online activity tracker
app.use(trackActivity);

// import routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const reportRouter = require('./routes/report');
const forumRouter = require('./routes/forum');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const searchRouter = require('./routes/search');
const adminRouter = require('./routes/admin');

// use routes to handle requests
app.use('/', indexRouter)
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/report', reportRouter);
app.use('/forum', forumRouter);
app.use('/forum/:id', postRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);

// server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})