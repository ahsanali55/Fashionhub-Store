// First, we need to tell TypeScript that Express requests can have a user.
import { IUser } from "../interfaces/user.interface";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
export {};