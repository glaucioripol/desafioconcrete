const Route = require("express").Router()
const middleware = require("./utils/middleware")


Route
    .post("/signup")
    .post("/signin")
    .get("/user/:id", middleware)