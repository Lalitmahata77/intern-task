import {z} from "zod"
export const isServer = typeof window === 'undefined';
export const productSchema = z.object({
    name : z.string({message : "Product name should be string"}).min(4),
    description : z.string({message : "Product description should be string"}),
    image: z.instanceof(isServer ? File : FileList, { message: 'Product image should be a image' }),
    initial_stock : z.number(),
    availabel_stock: z.number(),
    categoryId: z.number().int().positive()

})