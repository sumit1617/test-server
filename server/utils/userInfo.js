const user = require("../model/user");

const userInfo = (user) => {
  return {
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
  };
};

module.exports = userInfo;
