const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Helper functions
const { deleteURL, updateURL } = require('./helpers/urlHelpers');
const { isEmptyInput, emailExists, dataMatches, findUserID } = require('./helpers/loginHelpers');
const { generateRandomString } = require('./helpers/generateRandomString');
const { urlsForUser } = require('./helpers/permissionHelpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Server set up
app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Global objects
const urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'boyjd4'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'boyjd4'
  }
};

const users = {
  'boyjd4': {
    id: 'boyjd4',
    email: 'hello@example.com',
    password: 'tomato'
  },
  's83kdi': {
    id: 's83kdi',
    email: 'user@example.com',
    password: 'purple'
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Helo <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  // if user is logged in, display urls that match logged in user's userID
  const userID = req.cookies['user_id'];
  const userURLs = urlsForUser(urlDatabase, userID);
  const templateVars = {
    urls: userURLs,
    user: users[userID]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  // if not logged in, redirect to login
  const userID = req.cookies['user_id'];
  if (!userID) {
    res.redirect('/login');
  } else {
    const templateVars = {
      user: users[userID]
    };
    res.render('urls_new', templateVars);
  }

});

app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  const userID = req.cookies['user_id'];

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userID
  };
  // Log the new URL Database to the console
  console.log('Current URL Database\n', urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']]
  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!longURL) {
    res.statusCode = 400;
    res.send('404 Page Not Found');
  } else {
    res.redirect(longURL);
  }
});

// Delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('Removed from URL Database:', shortURL, urlDatabase[shortURL]);
  deleteURL(urlDatabase, shortURL);

  res.redirect('/urls');
});

// Update a URL
app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const newURL = req.body.newURL;
  console.log('Updated URL Database:', shortURL, newURL);
  updateURL(urlDatabase, shortURL, newURL);

  res.redirect(`/urls/${shortURL}`);
});

// Username login
app.get('/login', (req, res) => {
  const templateVars = { user: null };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  const emailMatch = dataMatches(users, 'email', inputEmail) ? true : false;
  const passwordMatch = dataMatches(users, 'password', inputPassword) ? true : false;

  if (!emailMatch) {
    // TO DO: display error message to user
    res.statusCode = 403;
    console.log('Email does not match database');
    res.redirect('/login');

  } else {
    if (!passwordMatch) {
      // TO DO: display error message to user
      // TO DO: if user has entered email field, keep input
      res.statusCode = 403;
      console.log('Password does not match database');
      res.redirect('/login');

    } else {
      const userID = findUserID(users, inputEmail);
      console.log('User logged in:', users[userID].email);
      res.cookie('user_id', userID);
      res.redirect('/urls');
    }

  }
});

// User logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');

  res.redirect('/urls');
});

// User registration
app.get('/register', (req, res) => {
  const templateVars = { user: null };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  if (isEmptyInput(inputEmail)) {
    res.statusCode = 400;
    // TO DO: display error message to user
    res.redirect('/register');
    console.log('Input email is empty');

  } else if (isEmptyInput(inputPassword)) {
    res.statusCode = 400;
    // TO DO: display error message to user
    // TO DO: if user had entered something in email, keep input when redirecting
    res.redirect('/register');
    console.log('Input password is empty');

  } else if (emailExists(users, inputEmail)) {
    // TO DO: display error message to user
    res.redirect('/register');
    console.log('Registration email already exists');

  } else {
    const newUser = {
      id: userID,
      email: inputEmail,
      password: inputPassword
    };
  
    users[userID] = newUser;
    res.cookie('user_id', userID);
    console.log('Updated users database:', users);
  
    res.redirect('/urls');
  }

});