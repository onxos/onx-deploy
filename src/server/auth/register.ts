import { z } from "zod";

export const registerInputSchema = z.strictObject({
  email: z.email().max(254),
  password: z.string().min(12).max(128),
  name: z.string().trim().min(2).max(100),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export function toRegisterBody(input: RegisterInput) {
  return {
    email: input.email.toLowerCase(),
    password: input.password,
    name: input.name,
  };
}
