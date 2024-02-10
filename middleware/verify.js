import Admin from "../models/admins.js";
import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";
import PowerData from "../models/power.js";
import config from "../config.json" assert { type: "json" };

export async function Verify(req, res, next) {
  const authHeader = req.headers["cookie"];

  if (!authHeader) return res.sendStatus(401);
  const cookie = authHeader.split("=")[1];

  const checkIfBlacklisted = await Blacklist.findOne({ token: cookie });

  if (checkIfBlacklisted)
    return res.redirect("/login")

  jwt.verify(cookie, config.secret_access_token, async (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    const { id } = decoded;
    const user = await Admin.findById(id);
    const { password, ...data } = user._doc;
    req.user = data;
    next();
  });
}

export function VerifyType(req, res, next) {
  try {
    const user = req.user;
    const { acc_type } = user;

    if (acc_type !== "main" && acc_type !== "power" && acc_type !== "special") {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this content!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
}

export function VerifyPower(req, res, next) {
  try {
    const user = req.user;
    const { acc_type } = user;

    if (acc_type !== "power") {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this content!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
}

export function VerifySpecial(req, res, next) {
  try {
    const user = req.user;
    const { acc_type } = user;

    if (acc_type !== "power" && acc_type !== "special") {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this content!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
}

export async function VerifySystem(req, res, next) {
  try {
    const data = await PowerData.findById("65216c72dce0a680475a124c");
    
    if (data.system_off !== false) {
      return res.render("down")
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
}