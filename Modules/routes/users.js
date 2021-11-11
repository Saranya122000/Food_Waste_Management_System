const express = require("express");
const path = require("path");

const login = require("../controller/login");
private_routes = express.Router();
public_routes = express.Router();
const isAuth = require('../middleware/is_auth');
const isSetter = require('../middleware/is_setter');
const isnotAuth = require('../middleware/is_not_auth');

public_routes.get("/home",(req,res,next) => {
    res.sendFile(path.join(__dirname,"..","views","home.html"));
});

private_routes.get("/login",isnotAuth,(req,res,next) => {
    res.render("login",{
        errorMessage: '',
        oldinput: {
            username: '',
        },
        validationErrors: []});
});