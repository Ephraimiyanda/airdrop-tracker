import { deleteAirdrop, updateAirdrop } from "../../controller/app.controller";
import authenticateToken from "../../middleware";

export default async function handler(req: any, res: any) {
  if (req.method === "PUT") {
    return authenticateToken(req, res, () => updateAirdrop(req, res));
  }
  if (req.method === "DELETE") {
    return authenticateToken(req, res, () => deleteAirdrop(req, res));
  }
  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
