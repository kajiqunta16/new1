import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // your custom property
      tokenPayload?: JwtPayload; // optional if you want
    }
  }
}