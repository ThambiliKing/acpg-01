import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    admission_no: {
      type: Number,
      default: 2023607
    },
    student_class: {
      type: String,
      required: "Class is required",
    },
    year: {
      type: Number,
      required: "Year is required",
    },
    reasons: [{ name: String, resolved: Boolean, captured_date: Date }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
