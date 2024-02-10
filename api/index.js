import express from "express";
import { Register, Login, Logout } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("password").not().isEmpty(),
  Validate,
  Login
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("acc_type")
    .not()
    .isEmpty()
    .withMessage("Account type is required")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Must be at least 8 chars long"),
  Validate,
  Register
);

router.post("/logout", Logout);

export default router;
