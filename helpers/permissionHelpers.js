const urlsForUser = (obj, user) => {
  let urls = {};
  for (let key in obj) {
    if (obj[key].userID === user) {
      urls[key] = obj[key].longURL;
    }
  }
  return urls;
};

module.exports = { urlsForUser };