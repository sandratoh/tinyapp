const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

const generateRandomString = () => {
  let str = Math.random().toString(36).substring(7);
  return str;
};

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const deleteURL = (urlObj, key) => {
  delete urlObj[key];
};

const updateURL = (urlObj, key, newURL) => {
  return urlObj[key] = newURL;
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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
    username: req.cookies['username']
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username']
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
    username: req.cookies['username']
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
app.post('/login', (req, res) => {
  const username = req.body.username;
  console.log('User signed in:', username);
  res.cookie('username', username);
  
  res.redirect('/urls');
});

// Username logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');

  res.redirect('/urls');
});

// Registration form
app.get('/register', (req, res) => {
  res.render('register');
});