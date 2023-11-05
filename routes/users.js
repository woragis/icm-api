const router = require("express").Router();

const { getUsers } = require("../controllers/users");

router.route("/").get(getUsers);

module.exports = router;
