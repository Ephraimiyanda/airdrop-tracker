import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username },
    //@ts-ignore
    process.env.JWT_SECRET,
    {
      expiresIn: "2 days",
    }
  );
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export { User };
