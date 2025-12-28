// PACKAGES CONFIGURATIONS

const Register = require("../model/registerModel");
const logger = require("../config/logger");

// POST METHOD FOR THE REGISTER

const PostRegister = async (req, res) => {
  try {
    const response = await Register.create(req.body);
    res.status(201).json({
      status: "created",
      message: "Registeration Completed Successfully",
      response,
    });
    logger.info("Registeration Done Successfully");
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err.message,
    });
    logger.warning("Registeration Failed - ", err.message);
  }
};

module.exports = PostRegister;
