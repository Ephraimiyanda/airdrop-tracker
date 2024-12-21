import { createAirdrop, getAirdrops } from "../../controller/app.controller";
import authenticateToken from "../../middleware";
const Db = require("../../config/db");
export default async function handler(req: any, res: any) {
  Db();
  if (req.method === "GET") {
    return authenticateToken(req, res, () => getAirdrops(req, res));
  }
  if (req.method === "POST") {
    return authenticateToken(req, res, () => createAirdrop(req, res));
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
