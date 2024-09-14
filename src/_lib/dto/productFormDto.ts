import {z} from "zod";

enum ProductStatus {
    draft = "DRAFT",
    published = "PUBLISHED",
    discontinued = "DISCONTINUED"
}
type Variant = {
    name: string;
    price: number;
    isRequired: boolean;
}
const MAX_FILE_SIZE = 100 * 1024;
const fileSchema = z.custom<File>((file) => {
    return file instanceof File;
}, "Must be a file").refine((file) => {
    return file instanceof File && file.size <= MAX_FILE_SIZE;
}, (file) => ({message:`File ${file.name} must be no larger than ${MAX_FILE_SIZE / 1024}KB`}));

const variantSchema = z.object({
    name: z.string(),
    price: z.number().optional(),
    isRequired: z.boolean().default(false),
})
const variantGroupSchema = z.object({
    name: z.string(),
    variants: z.array(variantSchema)
})
export const createProductSchema = z.object({
    productId: z.string().optional(),
    productName: z.string().min(1, {
        message: 'Product name is too short'
    }),
    price: z.coerce.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    }).gt(0),
    category: z.string().min(10,{
        message: 'Selecciona una categoría'
    }),
    subCategory: z.string().optional(),
    description: z.string().min(10,{
        message: 'Write a description'
    }).optional(),
    ingredients: z.array(z.string()).optional(),
    variantGroups: z.array(variantGroupSchema).optional(),
    images: z.array(fileSchema).optional(),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.draft),
    highlight: z.boolean(),
    offerPrice: z.coerce.number({
        invalid_type_error: 'Price must be a number',
    }).transform(arg => arg === 0 ? undefined : arg).optional(),
    publishDate: z.date().optional()
}).refine((data) => {
    console.log(data.offerPrice, data.price, data.offerPrice! >= data.price);
    if (data.offerPrice === undefined) return true;
    return data.offerPrice <= data.price
},{
    message: 'Offer must be less than price',
    path: ['offerPrice']
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;