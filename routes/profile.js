const router = require("express").Router();

const {
  getProfile,
  editProfile,
  deleteProfile,
} = require("../controllers/profile");

router
  .route("/")
  .get(getProfile)
  .patch(editProfile)
  .put(editProfile)
  .delete(deleteProfile);

module.exports = router;
