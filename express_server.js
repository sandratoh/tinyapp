const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Helper functions
const { deleteURL, updateURL } = require('./helpers/urlHelpers');
const { isEmptyInput, emailExists, dataMatches } = require('./helpers/loginHelpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Server set up
app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Global objects
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

// Global helper functions
const generateRandomString = () => {
  let str = Math.random().toString(36).substring(7);
  return str;
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
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']]
  };
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {
  // Respond with randomly generated 6 character string
  res.statusCode = 200;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  // Log the new URL Database to the console
  console.log('Current URL Database\n', urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']]
  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
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
  res.render('login');
});

app.post('/login', (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  const emailMatch = dataMatches(users, 'email', inputEmail) ? true : false;
  const passwordMatch = dataMatches(users, 'password', inputPassword) ? true : false;
  // if email and pw both match
  if (emailMatch && passwordMatch) {
    res.redirect('/urls');
  }

  // if (dataMatches(users, 'email', inputEmail)) {
  //   console.log('email matches');
  // }

  // if (dataMatches(users, 'password', inputPassword)) {
  //   console.log('password matches');
  // }
  
  // login if inputEmail matches the one from user database

  // error if wrong password or empty fields

  // set cookies to user_id once logged in
  // res.send('ok');
  
});

// User logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');

  res.redirect('/urls');
});

// User registration
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  if (isEmptyInput(inputEmail)) {
    res.statusCode = 400;
    // redirect back to register page, but add error message in ejs
    res.redirect('/register');
    // res.send('Please enter an email');
    console.log('Input email is empty');

  } else if (isEmptyInput(inputPassword)) {
    res.statusCode = 400;
    // redirect back to register page, but add error message in ejs
    // try and keep whatever email was input previously
    res.redirect('/register');
    // res.send('Please enter a password');
    console.log('Input password is empty');

  // if registrating with email that already exists
  } else if (emailExists(users, inputEmail)) {
    // redirect back to register page, but add error message in ejs
    // console.log(emailExists(inputEmail));
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