// PACKAGE CONFIGURATION

const express = require("express");
const PostRegister = require("../controller/registerController");
const app = express();

// ROUTER CONFIGURATION

const RegisterRouter = express.Router();

// MIDDLEWARE CONFIGURATION

app.use(express.json());

// ROUTES INTEGRATION

RegisterRouter.post("/", PostRegister);

module.exports = RegisterRouter;
