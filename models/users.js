const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    token: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//store the hashed password in database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
