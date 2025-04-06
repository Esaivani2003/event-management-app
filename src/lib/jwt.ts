import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET ||'esai1906';

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET_KEY) as { userId: string; email: string;role:string };
}

export function signToken(payload: { userId: string; email: string ;role:'ADMIN'|'USER'}) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}
