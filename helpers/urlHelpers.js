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
  const databaseKeys = Object.keys(databaseObj);
  databaseKeys.includes(shortURL) ? true : false;
};

module.exports = { deleteURL, updateURL, validDatabaseShortURL };