exports.registerBody = (body) => {
  return {
    name: body.userName,
    email: body.userEmail,
    password: body.userPassword,
  };
};

exports.loginBody = (body) => {
  return {
    email: body.userEmail,
    password: body.userPassword,
  };
};

exports.roleBody = (body) => {
  return {
    role: body.userRole,
  };
};

exports.profileBody = (body) => {
  return {
    name: body.userName,
    email: body.userEmail,
  };
};
