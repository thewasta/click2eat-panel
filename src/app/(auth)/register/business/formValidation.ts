import {z} from "zod";

export const registerBusiness = z.object({
    businessName: z.string({required_error: 'businessName is required'}).min(1),
    document: z.string({required_error: 'document is required'}).min(1),
    address: z.string({required_error: 'address is required'}).min(1),
    postalCode: z.string({
        required_error: 'postalCode is required',
        invalid_type_error: 'postalCode is required'
    }).min(4),
    province: z.string({required_error: 'province is required'}).min(1),
    town: z.string({required_error: 'town is required'}).min(1),
    country: z.string({required_error: 'country is required'}).min(1),
});

export type RegisterBusinessDto = z.infer<typeof registerBusiness>;
