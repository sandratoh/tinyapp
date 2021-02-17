const isEmptyInput = input => !input ? true : false;

const emailExists = (obj, email) => {
  for (let user in obj) {
    if (email === obj[user].email) {
      return true;
    }
  }
  return false;
};

module.exports = { isEmptyInput, emailExists };