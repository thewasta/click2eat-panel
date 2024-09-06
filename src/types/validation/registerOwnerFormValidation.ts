import {z} from "zod";

export const registerOwnerSchema = z.object({
    name: z.string({
        required_error: 'name is required'
    }).min(1),
    lastName: z.string({
        required_error: 'lastName is required'
    }).min(1),
    username: z.string({
        required_error: 'username is required'
    }).min(1),
    email: z.string({
        required_error: 'email is required'
    }).email(),
    password: z.string({
        required_error: 'password is required'
    }).min(8),
    confirmPassword: z.string({
        required_error: 'confirmPassword is required'
    }).min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
});

export type RegisterOwnerFormSchema = z.infer<typeof registerOwnerSchema>;