import express from "express";
import { Logout } from "../controllers/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/login")
})

router.get("/login", (req, res) => {
    res.render("login", {
        res: res
    });
});

router.get("/logout", Logout)

export default router;
