import {z} from "zod";

export const createProductSchema = z.object({
    businessUuid: z.string().optional(),
    name: z.string().min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0),
    category: z.string().refine(value => /*value !== "0"*/true, {
        message: 'Secciona una categoría'
    }),
    subCategory: z.string().optional(),
    description: z.string().min(10,{
        message: 'Write a description'
    }),
    ingredients: z.string().optional(),
    // @todo Debe ser plural
    image: z.array(z.instanceof(File)),
    status: z.string(),
    highlight: z.boolean().optional(),
    offerPrice: z.coerce.number({
        invalid_type_error: 'Price must be a number',
    }).transform(arg => arg === 0 ? undefined : arg).optional(),
    publishDate: z.date().optional()
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;