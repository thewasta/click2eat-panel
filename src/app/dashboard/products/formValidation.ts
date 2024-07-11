import {z} from "zod";

export const createProductSchema = z.object({
    name: z.string({
        required_error: 'Product name is required'
    }).min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0),
    category: z.string(),
    subCategory: z.string(),
    description: z.string(),
    image: z.array(z.instanceof(File)).optional(),
    status: z.string(),
    highlight: z.boolean(),
    offerPrice: z.coerce.number({
        invalid_type_error: 'Price must be a number',
    }).gt(0).optional(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
