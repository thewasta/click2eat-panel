import {z} from "zod";

export const profileSchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }).min(1, {
        message: 'Name is required'
    }),
    lastname: z.string({
        required_error: 'Name is required'
    }).min(1, {
        message: 'Name is required'
    }),
    avatar: z.string({
        required_error: 'Name is required'
    }).min(1, {
        message: 'Name is required'
    }),
})

export type RegisterProfileDTO = z.infer<typeof profileSchema>;