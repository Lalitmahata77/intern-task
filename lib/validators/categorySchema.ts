import {z} from "zod"
export const isServer = typeof window === 'undefined';
export const categorySchema = z.object({
    name : z.string({message : "Category name should be string"}),
    image: z.instanceof(isServer ? File : FileList, { message: 'Category image should be a image' }),
})