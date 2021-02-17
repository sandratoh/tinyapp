const isEmptyInput = input => !input ? true : false;

const emailExists = (obj, email) => {
  for (let user in obj) {
    if (email === obj[user].email) {
      return true;
    }
  }
  return false;
};

const dataMatches = (obj, dataType, input) => {
  for (let user in obj) {
    if (obj[user][dataType] === input) {
      return true;
    }
  }
  return false;
};

module.exports = { isEmptyInput, emailExists, dataMatches };