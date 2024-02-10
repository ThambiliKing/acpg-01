import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.json" assert { type: "json" };

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username is required",
    },
    email: {
      type: String,
      required: "Email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Password is required",
      select: false,
    },
    acc_type: {
      type: String,
      enum: ["main", "sub", "power", "special"],
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function(next) {
  const admin = this;

  if (!admin.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(admin.password, salt, (err, hash) => {
      if (err) return next(err);

      admin.password = hash;
      next();
    });
  });
});

adminSchema.methods.generateAccessJWT = function() {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, config.secret_access_token, {
    expiresIn: "20m",
  });
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
