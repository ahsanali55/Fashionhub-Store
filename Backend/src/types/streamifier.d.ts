declare module "streamifier" {
  import { Readable } from "stream";
  export function createReadStream(input: Buffer | string, options?: any): Readable;
}