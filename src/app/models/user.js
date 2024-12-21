// src/app/models/user.js
const mongoose = require('mongoose');

/**
 * @typedef {Object} IUser
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {boolean} admin
 */

/**
 * User Schema for MongoDB
 * @type {mongoose.Schema<IUser>}
 */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = { User };
