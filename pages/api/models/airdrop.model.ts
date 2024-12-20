import mongoose from "mongoose";
// Airdrop Schema and Model
const airdropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Airdrop =
  mongoose.models.Airdrop || mongoose.model("Airdrop", airdropSchema);

export { Airdrop };
