import {z} from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0),
    category: z.string(),
    subCategory: z.string().optional(),
    description: z.string().min(10,{
        message: 'Write a description'
    }),
    images: z.array(z.instanceof(File)).optional(),
    status: z.string(),
    highlight: z.boolean().optional(),
    offerPrice: z.coerce.number({
        invalid_type_error: 'Price must be a number',
    }).transform(arg => arg === 0 ? undefined : arg).optional(),
    publishDate: z.date().optional()
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;