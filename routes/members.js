const router = require("express").Router();

const {
  getMembers,
  insertMember,
  getMember,
  updateMember,
  deleteMember,
} = require("../controllers/members");

router.route("/").get(getMembers).post(insertMember);
router
  .route("/:id")
  .get(getMember)
  .put(updateMember)
  .patch(updateMember)
  .delete(deleteMember);

module.exports = router;
