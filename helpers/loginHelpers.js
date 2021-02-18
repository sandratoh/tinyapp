const isEmptyInput = input => !input ? true : false;

const emailExists = (obj, inputEmail) => {
  for (let user in obj) {
    if (obj[user].email === inputEmail) {
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

const findUserIdByEmail = (obj, inputEmail) => {
  let userID;
  for (let user in obj) {
    if (obj[user].email === inputEmail) {
      userID = obj[user].id;
    }
  }
  return userID;
};

module.exports = { isEmptyInput, emailExists, dataMatches, findUserIdByEmail };