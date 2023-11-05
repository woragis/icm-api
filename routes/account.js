const router = require("express").Router();

const { register, login, logout } = require("../controllers/account");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
