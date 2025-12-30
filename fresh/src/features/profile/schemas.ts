/**
 * Profile Feature - Zod Validation Schemas
 * 2025 Elite Frontend Architecture
 */

import { z } from "zod"

// Profile info validation
export const profileFormSchema = z.object({
    fullName: z
        .string()
        .min(2, "სრული სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს")
        .max(100, "სრული სახელი ძალიან გრძელია"),
    email: z
        .string()
        .email("არასწორი ელ. ფოსტის ფორმატი"),
    username: z
        .string()
        .min(3, "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
        .max(30, "მომხმარებლის სახელი ძალიან გრძელია")
        .regex(/^[a-zA-Z0-9_]+$/, "დასაშვებია მხოლოდ ასოები, ციფრები და ქვედა ხაზი"),
    bio: z
        .string()
        .max(500, "ბიო ძალიან გრძელია")
        .optional(),
})

// Password change validation
export const passwordFormSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "შეიყვანეთ მიმდინარე პაროლი"),
        newPassword: z
            .string()
            .min(8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს")
            .regex(/[A-Z]/, "პაროლი უნდა შეიცავდეს დიდ ასოს")
            .regex(/[a-z]/, "პაროლი უნდა შეიცავდეს პატარა ასოს")
            .regex(/[0-9]/, "პაროლი უნდა შეიცავდეს ციფრს"),
        confirmPassword: z
            .string()
            .min(1, "გაიმეორეთ პაროლი"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "პაროლები არ ემთხვევა",
        path: ["confirmPassword"],
    })

// Privacy settings validation
export const privacySettingsSchema = z.object({
    profileVisible: z.boolean(),
    showEmail: z.boolean(),
    showActivity: z.boolean(),
    showSubscriptions: z.boolean(),
    allowMessages: z.boolean(),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
export type PasswordFormData = z.infer<typeof passwordFormSchema>
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>
