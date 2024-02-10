import mongoose from "mongoose";

const PowerScheme = new mongoose.Schema(
  {
    system_off: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("power", PowerScheme);
