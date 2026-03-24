import { randomInt } from "node:crypto";

function generateTokenAuth(): string {
  return randomInt(100000, 1000000).toString();
}

export { generateTokenAuth };
