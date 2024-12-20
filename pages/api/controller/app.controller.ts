import { Airdrop } from "../models/airdrop.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Controller Functions
export const registerUser = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(402).json({ error: "username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error registering user", error: err.message });
  }
};

export const loginUser = async (
  req: { body: { username: string; password: string } },
  res: any
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

export const getAirdrops = async (req: { user: { id: any } }, res: any) => {
  try {
    const airdrops = await Airdrop.find({ userId: req.user.id });
    //@ts-ignore
    res.status(200).json(airdrops);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error fetching airdrops", error: err.message });
  }
};

export const createAirdrop = async (
  req: { body: { name: any; link: any; status: any }; user: { id: any } },
  res: any
) => {
  try {
    const { name, link, status } = req.body;
    const newAirdrop = new Airdrop({ name, link, status, userId: req.user.id });
    await newAirdrop.save();
    res.status(201).json(newAirdrop);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error adding airdrop", error: err.message });
  }
};

export const updateAirdrop = async (
  req: {
    query: { id: any };
    body: { name: any; link: any; status: any };
    user: { id: any };
  },
  res: any
) => {
  try {
    const { id } = req.query;
    const { name, link, status } = req.body;
    const updatedAirdrop = await Airdrop.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, link, status },
      { new: true }
    );
    if (!updatedAirdrop)
      return res.status(404).json({ message: "Airdrop not found" });
    res.status(200).json(updatedAirdrop);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error updating airdrop", error: err.message });
  }
};

export const deleteAirdrop = async (
  req: { query: { id: any }; user: { id: any } },
  res: any
) => {
  try {
    const { id } = req.query;
    const deletedAirdrop = await Airdrop.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deletedAirdrop)
      return res.status(404).json({ message: "Airdrop not found" });
    res.status(200).json({ message: "Airdrop deleted successfully" });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Error deleting airdrop", error: err.message });
  }
};
