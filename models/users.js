const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    habits: [
      {
        date: {
          type: Date,
          required: true,
        },
        diet: {
          type: String,
          enum: ["done", "not done", "none"],
        },
        walk: {
          type: String,
          enum: ["done", "not done", "none"],
        },
        book: {
          type: String,
          enum: ["done", "not done", "none"],
        },
        coding: {
          type: String,
          enum: ["done", "not done", "none"],
        },
        homework: {
          type: String,
          enum: ["done", "not done", "none"],
        },
        skincare: {
          type: String,
          enum: ["done", "not done", "none"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
