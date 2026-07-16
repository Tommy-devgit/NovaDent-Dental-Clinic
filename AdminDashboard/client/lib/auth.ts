import bcrypt from "bcryptjs";

export async function hashStaffPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyStaffPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
