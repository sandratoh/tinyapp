const deleteURL = (urlObj, key) => {
  delete urlObj[key];
};

const updateURL = (urlObj, key, newURL, user) => {
  return urlObj[key] = {
    longURL: newURL,
    userID: user
  };
};

module.exports = { deleteURL, updateURL };