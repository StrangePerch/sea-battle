const express = require("express");
const router = express.Router();

const userController = require("./controllers/userController")
router.post("/register", userController.Register)
router.post("/login", userController.Login)
router.get("/user", userController.GetUser)
router.get("/logout", userController.LogOut)

const gameController = require("./controllers/gameController")
router.get("/findGame", gameController.FindGame)
router.post("/move", gameController.Move)

module.exports = router;