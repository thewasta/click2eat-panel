import {z} from "zod";

export const registerBusinessSchema = z.object({
    businessName: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    document: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    address: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    postalCode: z.coerce.number({
        required_error: 'Rellena los campos obligatorios',
        invalid_type_error: 'Rellena los campos obligatorios'
    }).min(4),
    province: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    town: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    country: z.string({required_error: 'Rellena los campos obligatorios'}).min(1),
    timeZone: z.number()
});

export type RegisterFormSchema = z.infer<typeof registerBusinessSchema>;