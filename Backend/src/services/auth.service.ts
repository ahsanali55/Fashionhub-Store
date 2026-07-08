import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { ApiError } from "../utils/ApiError";

interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  role?: "customer" | "supplier";
}

export const registerUser = async (
  data: RegisterUserData
): Promise<IUser> => {
  const { fullName, email, password, role = "customer" } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError( 409, "User already exists" );
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

  return user;
};

interface LoginUserData {
  email: string;
  password: string;
}

export const loginUser = async (
  data: LoginUserData
): Promise<IUser> => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "Invalid email or password.");
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(404, "Invalid email or password.");
  }

  return user;
};
