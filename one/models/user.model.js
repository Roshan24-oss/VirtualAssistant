import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    assistantName: {
      type: String,
      trim: true,
    },
    assistantImage: {
      type: String,
    },
    history: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
