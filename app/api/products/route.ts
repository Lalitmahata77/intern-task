import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { isServer, productSchema } from "@/lib/validators/productSchema";
import { desc } from "drizzle-orm";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
    const data = await request.formData()
    let validateData;
    try {
        validateData = productSchema.parse({
            name : data.get('name'),
            description : data.get('description'),
            image : data.get('image'),
            initial_stock : Number(data.get('initial_stock')),
            availabel_stock : Number(data.get('availabel_stock')),
            categoryId : Number(data.get('categoryId'))
        })
        
    } catch (error) {
        return Response.json({message : error}, {status : 400})
    }

    const inputImage = isServer
    ? (validateData.image as File)
    : (validateData.image as unknown as FileList)[0];
    
const filename = `${Date.now()}.${inputImage.name.split('.').slice(-1)}`;

try {
    const buffer = Buffer.from(await inputImage.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/assets', filename), buffer);
    
} catch (error) {
    return Response.json({ message: 'Failed to save the file to fs' }, { status: 500 });
}

try {
    await db.insert(products).values({...validateData, image : filename})
    
} catch (error) {
    try {
        await unlink(path.join(process.cwd(), 'public/assets', filename));
    } catch (unlinkError) {
        console.error('Failed to delete image:', unlinkError);
    }

    
    return Response.json(
        { message: 'Failed to store product into the database' },
        { status: 500 }
    );
}
return Response.json({ message: 'OK' }, { status: 201 });
}

export async function GET(){
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.id))
        return Response.json(allProducts)
    } catch (error) {
        return Response.json({message : "Failed to fetch products"}, {status:500})
    }
}