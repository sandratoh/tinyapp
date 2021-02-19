// Library and Middleware Dependencies
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

// Helper functions
const { deleteURL, updateURL, validDatabaseShortURL } = require('./helpers/urlHelpers');
const { isEmptyInput, emailExists, dataMatches, findUserIdByEmail } = require('./helpers/loginHelpers');
const { generateRandomString } = require('./helpers/generateHelpers');
const { urlsForUser } = require('./helpers/permissionHelpers');

// Middleware Use
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['avocado', 'is green', 'so is broccoli']
}));

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
    password: '$2a$10$7RmcG8AhcqTh58ZZcVoyguFyLVRrCnygkftpRPpXSOr8fHKv./nAe' // tomato
  },
  's83kdi': {
    id: 's83kdi',
    email: 'user@example.com',
    password: '$2a$10$dFwdXm8kV8MXYcICVj0caup8W.FglJCeccbG/rLdOUod/98E023wm' // purple
  }
};

// Routes
app.get('/', (req, res) => {
  req.session.cookieUserId ? res.redirect('/urls') : res.redirect('/login');
});

app.get('/urls', (req, res) => {
  // Not shown here: if user is not logged in (no cookieUserId found), html file will show welcome page
  const userID = req.session.cookieUserId;
  const userURLs = urlsForUser(urlDatabase, userID);
  const templateVars = {
    urls: userURLs,
    user: users[userID]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.session.cookieUserId;
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
  const shortURL = generateRandomString();
  const userID = req.session.cookieUserId;

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userID
  };
  // Log the new URL Database to the console
  console.log('Current URL Database\n', urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const inputShortURL = req.params.shortURL;

  if (!validDatabaseShortURL(urlDatabase, inputShortURL)) {
    res.status(404).send('404 Error: Invalid URL ID Entered');

  } else {
    const user = req.session.cookieUserId;
    let templateVars = {
      shortURL: inputShortURL,
      longURL: urlDatabase[inputShortURL].longURL,
      user: users[user],
      urlOwner: false
    };

    if (user === urlDatabase[inputShortURL].userID) {
      templateVars.urlOwner = true;
      res.render("urls_show", templateVars);
    } else {
      res.render("urls_show", templateVars);
    }
  }
});

app.get('/u/:shortURL', (req, res) => {
  const inputShortURL = req.params.shortURL;
  if (!validDatabaseShortURL(urlDatabase, inputShortURL)) {
    res.status(404).send('404 Error: Invalid URL ID Entered');
  
  } else {
    const longURL = urlDatabase[inputShortURL].longURL;
    if (!longURL) {
      res.statusCode = 400;
      res.send('404 Error: URL Not Found');
    } else {
      res.redirect(longURL);
    }
  }
});

// Delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  if (!validDatabaseShortURL(urlDatabase, shortURL)) {
    res.status(404).send('404 Error: Invalid URL ID Entered');
  
  } else {
    const user = req.session.cookieUserId;
    const urlOwner = urlDatabase[shortURL].userID;

    if (user !== urlOwner) {
      res.status(403).send('403 Error: Only URL owner can remove URLs.');
    } else {
      console.log('Removed from URL Database:', shortURL, urlDatabase[shortURL].longURL);
      deleteURL(urlDatabase, shortURL);
      res.redirect('/urls');
    }
  }
});

// Update a URL
app.post('/urls/:shortURL', (req, res) => {
  const user = req.session.cookieUserId;
  const shortURL = req.params.shortURL;
  const urlOwner = urlDatabase[shortURL].userID;
  if (!user || urlOwner !== user) {
    res.status(403).send('403 Error: Only URL owners can edit');
  } else {
    const newURL = req.body.newURL;
    updateURL(urlDatabase, shortURL, newURL, user);
    console.log('Updated URL Database:', shortURL, urlDatabase[shortURL]);
  }
  res.redirect('/urls');
});

// Username login
app.get('/login', (req, res) => {
  const templateVars = { user: null };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const inputEmail = req.body.email;
  const emailMatch = dataMatches(users, 'email', inputEmail) ? true : false;
  
  if (!emailMatch) {
    console.log('Email does not match database');
    res.status(403).send('The email or password you entered is incorrect.');
    
  } else {
    const inputPassword = req.body.password;
    const userID = findUserIdByEmail(users, inputEmail);
    const databasePassword = users[userID].password;

    bcrypt.compare(inputPassword, databasePassword, (err, result) => {
      if (result) {
        console.log('User logged in:', users[userID].email);
        req.session.cookieUserId = (userID);
        res.redirect('/urls');
      } else {
        console.log('Password does not match database');
        res.status(403).send('The email or password you entered is incorrect.');
      }
    });
  }
});

// User logout
app.post('/logout', (req, res) => {
  req.session = null;

  res.redirect('/urls');
});

// User registration
app.get('/register', (req, res) => {
  if (req.session.cookieUserId) {
    res.redirect('/urls');
  }
  const templateVars = { user: null };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  if (isEmptyInput(inputEmail)) {
    res.status(400).send('Please enter an email');
    console.log('Input email is empty');

  } else if (isEmptyInput(inputPassword)) {
    res.status(400).send('Please enter a password');
    console.log('Input password is empty');

  } else if (emailExists(users, inputEmail)) {
    res.status(400).send('Email already exists');
    console.log('Registration email already exists');

  } else {
    bcrypt.hash(inputPassword, 10, (err, hash) => {
      const newUser = {
        id: userID,
        email: inputEmail,
        password: hash
      };
      users[userID] = newUser;
      req.session.cookieUserId = (userID);
      console.log('Updated users database:', users);
    
      res.redirect('/urls');
    });
  }
});