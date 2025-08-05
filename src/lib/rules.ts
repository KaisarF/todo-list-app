import { z } from 'zod'; 

export const registerSchema = z.object({
  email: z.email().refine((val) => val.endsWith('@squareteam.com'), {
    message: "Email must end with @squeareteam.com",
  }),
  fullName: z.string().trim().min(1, { message: "Please enter your name" }),
//   phoneNumber: z.string().trim().min(1, { message: "Please enter your phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),

});

export const loginSchema = z.object({
  email: z.email().trim().min(1, { message: "Please enter your email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
}) 