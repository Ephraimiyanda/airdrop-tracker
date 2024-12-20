import { registerUser } from "../controller/app.controller";
require("dotenv").config();
const Db = require("../config/db");

export default async function handler(req: any, res: any) {
  Db();
  if (req.method === "POST") {
    return registerUser(req, res);
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
