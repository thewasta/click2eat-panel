import {z} from "zod";

export const categorySchema = z.object({
    name: z.string().min(3),
    subCategory: z.string()
})

export type CategoryFormSchema = z.infer<typeof categorySchema>;