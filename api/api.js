import express from "express";
import { Verify, VerifyType } from "../middleware/verify.js";
import { Add, Search, Delete, Edit, Resolve, AddReason } from "../controllers/api.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/",
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isString()
    .trim()
    .escape(),
  check("student_class")
    .not()
    .isEmpty()
    .withMessage("Student Class is required")
    .trim()
    .isString()
    .escape(),
  check("year")
    .not()
    .isEmpty()
    .withMessage("Year is required")
    .trim()
    .isNumeric()
    .escape(),
  check("reasons")
    .not()
    .isEmpty()
    .withMessage("Reasons are required")
    .isArray(),
  Validate,
  Add
);

router.put("/:id", Edit);

router.put("/student/:id", AddReason)

router.post("/students", Search);

router.delete("/:id", Delete);

router.put(
  "/resolve/:id/:reason",
  check("reasons")
    .not()
    .isEmpty()
    .withMessage("Reasons are required")
    .isArray(),
  Validate,
  Resolve
);

router.post("/export")

export default router;
