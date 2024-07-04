import {z} from "zod";

export const registerLocalSchema = z.object({
    businessName: z.string({required_error: 'businessName is required'}).min(1),
    abbreviation: z.string().optional(),
    address: z.string({required_error: 'address is required'}).min(1),
    postalCode: z.string().min(4),
    province: z.string({required_error: 'province is required'}).min(1),
    town: z.string({required_error: 'town is required'}).min(1),
    country: z.string({required_error: 'country is required'}).min(1),
    image: z.any()
});

export type RegisterBusinessLocalDto = z.infer<typeof registerLocalSchema>;