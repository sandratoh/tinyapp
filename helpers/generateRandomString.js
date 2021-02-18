const generateRandomString = () => {
  let str = Math.random().toString(36).substring(7);
  return str;
};

module.exports = { generateRandomString };