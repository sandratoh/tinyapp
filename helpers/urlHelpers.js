const deleteURL = (urlObj, key) => {
  delete urlObj[key];
};

const updateURL = (urlObj, key, newURL, user) => {
  return urlObj[key] = {
    longURL: newURL,
    userID: user
  };
};

const validDatabaseShortURL = (databaseObj, shortURL) => {
  return Object.keys(databaseObj).includes(shortURL) ? true : false;
};

module.exports = { deleteURL, updateURL, validDatabaseShortURL };