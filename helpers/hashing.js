const Bcrypt = require("bcrypt");

exports.HashedPasswordFunc = async (password = "") => {
  const genSalt = await Bcrypt.genSalt(10);
  return await Bcrypt.hash(password, genSalt);
};

exports.ComparePasswordFunc = async (password = "", encyptedPassword = "") => {
  return await Bcrypt.compare(password, encyptedPassword);
};
