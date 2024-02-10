import bcrypt from "bcrypt";
import Admin from "../models/admins.js";
import Blacklist from "../models/Blacklist.js";

export async function Register(req, res) {
  const { username, email, acc_type } = req.body;
  try {
    const newUser = new Admin({
      username,
      email,
      password: req.body.password,
      acc_type,
    });

    const existingUser = await Admin.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "User already exists. Please login.",
      });
    const savedUser = await newUser.save();
    const { password, ...user_data } = savedUser._doc;
    res.status(200).json({
      status: "success",
      data: [user_data],
      message: "Account created successfully. Please login.",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Login(req, res) {
  const { email } = req.body;
  try {
    const user = await Admin.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Account does not exist",
      });
    const isPasswordValid = await bcrypt.compare(
      `${req.body.password}`,
      user.password
    );
    if (!isPasswordValid)
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });

    let options = {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    const token = user.generateAccessJWT();
    res.cookie("SessionID", token, options);

    const { password, ...user_data } = user._doc;

    res.status(200).json({
      status: "success",
      data: [user_data],
      message: "Admin logged in",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: err,
    });
  }
  res.end();
}

export async function Logout(req, res) {
  try {
    const authHeader = req.headers["cookie"];
    if (!authHeader) return res.sendStatus(204);
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(";")[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

    if (checkIfBlacklisted) return res.sendStatus(204);

    const newBlacklist = new Blacklist({
      token: accessToken,
    });
    await newBlacklist.save();

    res.setHeader("Clear-Site-Data", '"cookies", "storage"');
    res.redirect("/login")
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
  res.end();
}
