// PACKAGE CONFIGURATION

const express = require("express");
const PostRegister = require("../controller/registerController");
const logger = require("../config/logger");
const app = express();

// ROUTER CONFIGURATION

const RegisterRouter = express.Router();

// MIDDLEWARE CONFIGURATION

app.use(express.json());

// ROUTES INTEGRATION

RegisterRouter.post("/", PostRegister);


logger.info("RegisterRouter", RegisterRouter)

module.exports = RegisterRouter;
