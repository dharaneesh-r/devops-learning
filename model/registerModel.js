const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20, // increase max length a bit
    },
  },
  { timestamps: true }
);

const Register = mongoose.model("DevopsRegisterLearning", registerSchema);

module.exports = Register;
