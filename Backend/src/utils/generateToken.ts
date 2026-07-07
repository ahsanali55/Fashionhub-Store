import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const secret: Secret = process.env.JWT_SECRET!;

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secret, options);
};

export default generateToken;