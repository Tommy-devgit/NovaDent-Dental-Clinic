import { z } from "zod";

// Zod v4 deprecates `z.string().email()`. Validate via refine with a pragmatic regex.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .trim()
  .refine((value) => EMAIL_REGEX.test(value), { message: "Enter a valid email address" });
