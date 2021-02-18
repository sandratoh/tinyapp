const generateRandomString = () => {
  let str = Math.random().toString(36).substring(7);
  if (str.length !== 6) {
    str = generateRandomString();
  }
  return str;
};

console.log(generateRandomString());

module.exports = { generateRandomString };