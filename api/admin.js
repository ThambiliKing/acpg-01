import express from "express";
import Admin from "../models/admins.js";
import { Verify, VerifyType, VerifyPower, VerifySpecial } from "../middleware/verify.js";
import { Power } from "../controllers/api.js"

const router = express.Router();

router.post("/", Verify, (req, res) => {
  res
    .json({ message: "You are authorized to view read-only content" })
    .sendStatus(200);
});

router.post("/dashboard", Verify, VerifyType, (req, res) => {
  res
    .json({ message: "You are authorized to read and write content" })
    .sendStatus(200);
});

router.post("/power", Verify, VerifyPower, Power);

export default router;
