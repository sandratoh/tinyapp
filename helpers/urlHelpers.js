const deleteURL = (urlObj, key) => {
  delete urlObj[key];
};

const updateURL = (urlObj, key, newURL) => {
  return urlObj[key] = newURL;
};

module.exports = { deleteURL, updateURL };