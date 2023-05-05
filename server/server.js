const express = require('express');
const http = require('http'); // Required for socket.io
require('dotenv').config({path: '../.env'});
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();
const bikeTrailsRouter = require('./routers/bikeTrailsAPI');
const bikeTrailInfoRouter = require('./routers/bikeTrailInfoAPI');
const sessionRouter = require('./routers/sessionRouter')
const dbRouter = require('./routers/dbAPI');
const path = require('path');

// Socket.io implement start

const Server = require('socket.io').Server; // Required for socket.io
const server = http.createServer(app); // Creates an HTTP server using the express app for socket.io
const port = process.env.PORT || 4000

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', room => {
    socket.join(room);
  })

  socket.on('send-chat', (data, cb) => {
    socket.to(data.currentRoom).emit('recieve-chat', data);
    cb();
})

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

// Socket.io implement end

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./models/bikeTrailsModels');

app.use(session({
  secret: process.env.NODE_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 60000 * 60}, // expires in 1 day
}));
app.use(express.static(path.resolve(__dirname, '../client/dist')))
app.use(passport.initialize());
app.use(passport.session());

// https://www.passportjs.org/packages/passport-google-oauth20/
passport.use(new GoogleStrategy({
  clientID: process.env.VITE_GOOGLECLIENTID,
  clientSecret: process.env.VITE_GOOGLECLIENTSECRET,
  callbackURL: "/googlecallback",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
async function(accessToken, refreshToken, profile, cb) {
  console.log("PassportJS Google OAuth Profile logging: ", profile);
  try {
    const params1 = [email = profile.emails[0].value];
    const params2 = [email = profile.emails[0].value, username = profile.displayName];
    
    // Check if user exists in the database
    const findQueryString = `SELECT * FROM accounts WHERE email = $1`;
    const result = await db.query(findQueryString, params1);

    if (result.rows.length > 0) {
      // If the user exists, return the user object
      return cb(null, result.rows[0]);
    } else {
      // If the user does not exist, insert a new record and return the user object
      const createQueryString = `INSERT INTO accounts (email, name) VALUES ($1, $2) RETURNING *`;
      const insertResult = await db.query(createQueryString, params2);
      return cb(null, insertResult.rows[0]);
    }
  } catch (err) {
    return cb(err, null);
  }
}
));

// Serialize user using email
passport.serializeUser((user, done) => {
  done(null, user.email);
});

// Deserialize user using email
passport.deserializeUser(async (email, done) => {
  try {
    const queryString = `SELECT * FROM accounts WHERE email = $1`;
    const result = await db.query(queryString, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use('/api/trails', bikeTrailsRouter);
app.use('/api/moreInfo', bikeTrailInfoRouter);
app.use('/api/sessions', sessionRouter);
const corsOptions = {
  credentials: true,
  origin: '/'
};
app.use(cors(corsOptions))
app.use('/api/db', dbRouter);


app.get('/auth/google',
  (req, res, next) => {console.log("this is being hit 1"); return next();}, 
  // passport.authenticate('google', { scope: ["profile"] })
  passport.authenticate('google', { scope: ["profile", "email", "https://www.googleapis.com/auth/userinfo.profile"] })
);

app.get('/googlecallback',
  (req, res, next) => {console.log("this is being hit 2"); return next();},
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.status(200).redirect('https://trailblazers-app.azurewebsites.net');
  }
);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    req.logout(() => {
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    });
  });
});


app.use('*', (req, res) => {
  console.log("Redirecting to client app");
  return res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

server.listen(port, () => { console.log(`server started on port ${port}`) });