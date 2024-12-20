import jwt from "jsonwebtoken";
export default function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"]; // Retrieve the header

  if (!authHeader)
    return res.status(401).json({ message: "Access token missing" });

  // Ensure the token starts with "Bearer"
  const token = authHeader.split(" ")[1]; // Extract the token part (after 'Bearer')
  if (!token)
    return res.status(401).json({ message: "Invalid authorization format" });
  //@ts-ignore
  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = user; // Attach the decoded user to the request
    next();
  });
}
