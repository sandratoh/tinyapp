const urlsForUser = (obj, cookieID) => {
  let urls = {};
  for (let key in obj) {
    if (obj[key].userID === cookieID) {
      urls[key] = obj[key].longURL;
    }
  }
  return urls;
};

module.exports = { urlsForUser };