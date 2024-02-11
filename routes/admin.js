import express, { response } from "express";
import mongoose from "mongoose";
import Power from "../models/power.js"
import { Verify, VerifyType, VerifyPower, VerifySystem } from "../middleware/verify.js";

const router = express.Router();

router.get("/", Verify, VerifySystem, (req, res) => {
    fetch("http://localhost/api/students", {
        method: "POST",
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    }).then(data => {
        console.log(data);
        res.render("index", {
            data: data.data,
            i: 1
        });
    }).catch(error => {
        console.error(error); 
    });
});

router.get("/dashboard", Verify, VerifyType, VerifySystem, (req, res) => {
    fetch("http://localhost/api/students", {
        method: "POST",
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Request failed with status ' + response.status);
        }
    }).then(data => {
        console.log(data);
        res.render("dashboard", {
            data: data.data,
            i: 1
        });
    }).catch(error => {
        console.error(error); 
    });
});

router.get("/power", Verify, VerifyPower, async(req, res) => {
    const data = await Power.findOne({ _id: "65216c72dce0a680475a124c" });

    res.render("power", {
        data: data
    });
});

export default router;