const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  getAllUsers,
  getUser,
  updateRole,
  deleteUser,
  updateUserProfile,
  updatePassoword,
} = require("../controllers/userControllers");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/update").put(isAuthenticatedUser, updatePassoword);

router
  .route("/me")
  .get(isAuthenticatedUser, getUserDetails)
  .put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users/")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
