import {z} from "zod"
export const isServer = typeof window === 'undefined';
export const productSchema = z.object({
    name : z.string({message : "Product name should be string"}),
    description : z.string({message : "Product description should be string"}),
    image : z.instanceof(File, {message : "Product image should  be image"}),
    initial_stock : z.number(),
    availabel_stock: z.number(),
    categoryId : z.number()

})