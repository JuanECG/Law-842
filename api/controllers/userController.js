// Modules
const bcrypt = require('bcrypt');
const validations = require('../server/validation');
const jwt = require('jsonwebtoken');
// DB Models
const User = require('../models/User');

module.exports.registerUser = async (req, res) => {
  // Validate request body
  const { error } = validations.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Validate unique email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exist');
  // Hash password
  const hash = await bcrypt.hash(req.body.password, 10);
  // Create User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });
  try {
    await user.save();
    res.send(`User registed: ${user.name}`);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.loginUser = async (req, res) => {
  // Validate request body
  const { error } = validations.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Validate email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password is wrong');
  // Validate password
  const validPswd = await bcrypt.compare(req.body.password, user.password);
  if (!validPswd) return res.status(400).send('Email or password is wrong');
  // Create and assing a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
};
