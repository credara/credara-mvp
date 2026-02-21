import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

function isValidPhone(value: string, country: "NG" = "NG"): boolean {
  try {
    const phone = parsePhoneNumber(value, country);
    return phone?.isValid() ?? false;
  } catch {
    return false;
  }
}

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const userTypeValues = ["individual", "landlord", "fintech"] as const;
export type UserType = (typeof userTypeValues)[number];

export const userTypeLabels: Record<UserType, string> = {
  individual: "Individual",
  landlord: "Landlord",
  fintech: "Fintech",
};

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(200, "Name too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    userType: z.enum(userTypeValues),
    agreed: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreed === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
    path: ["agreed"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const onboardingSchema = z.object({
  userType: z.enum(userTypeValues),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(32, "Phone number too long")
    .refine((val) => isValidPhone(val, "NG"), "Invalid phone number"),
  businessName: z.string().max(255).optional(),
});
