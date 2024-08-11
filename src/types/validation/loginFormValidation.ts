import {z} from "zod";

export const loginSchema = z.object({
    username: z.string({
        required_error: 'Rellena los campos obligatorios'
    })
        .min(1, {
            message: 'Rellena los campos obligatorios'
        }),
    password: z.string({
        required_error: 'Rellena los campos obligatorios'
    })
        .min(1, {
            message: 'Rellena los campos obligatorios'
        })
});

export type LoginFormSchema = z.infer<typeof loginSchema>;