const Routes = require("express").Router()
const middleware = require("./utils/middleware")
const User = require("./controllers/Users")

Routes
    .post("/signup", User.store)
    .post("/signin", User.authorize)
    .get("/user/:id", middleware, User.show)

module.exports = Routes