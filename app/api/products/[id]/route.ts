import { db } from "@/lib/db/db"
import { products } from "@/lib/db/schema"
import { isServer, productSchema } from "@/lib/validators/productSchema"
import { eq } from "drizzle-orm"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

export async function GET(request:Request, {params} : {params :{id : string}}){
    const id = params.id
    try {
        const product = await db
        .select()
        .from(products)
        .where(eq(products.id,Number(id)))
        .limit(1)
        if (!product.length) {
            return Response.json({message : "Product not found"},{status:400})
        }

        return Response.json(product[0])
        
    } catch (error) {
        return Response.json({message : "Failed to fetch a product"},{status:500})
    }
}

export async function DELETE(request:Request, {params} : {params : {id : string}}){
    const id = params.id;
    try {
        const productResult = await db
        .select()
        .from(products)
        .where(eq(products.id, Number(id)))
        .limit(1)

        if (!productResult.length) {
            return Response.json({message : "Product not found"},{status:400})
        }
        const product = productResult[0];

        await db.delete(products).where(eq(products.id, Number(id)))
        if (product.image) {
            const imagePath = path.join(
              process.cwd(),
              'public/assets',
              product.image
            );
            await unlink(imagePath);
          }


    } catch (error) {
        return Response.json({message : "Failed to delete a product"},{status:500})

    }
}

export async function PUT(request:Request, {params} : {params : {id : string}}){
    const id = params.id
    let newImageFilename: string | undefined;
  let oldImageFilename: string | undefined;
    try {
        const existingProduct = await db.select().from(products).where(eq(products.id,Number(id))).limit(1)
        if (!existingProduct.length) {
            return Response.json({message : "Product not found"},{status:404})
        }
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

     // Process new image if provided
     if (validateData.image) {
        const inputImage = validateData.image as File;
        const ext = path.extname(inputImage.name);
        newImageFilename = `${Date.now()}${ext}`;
  
        // Save new image
        const uploadDir = path.join(process.cwd(), 'public/assets');
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await inputImage.arrayBuffer());
        await writeFile(path.join(uploadDir, newImageFilename), buffer);
  
        oldImageFilename = existingProduct.image;
      }
      const updateData: Partial<{
        name: string;
        description: string;
        initial_stock: number;
        available_stock: number;
        image: string;
        categoryId : number
      }> = {};
    
      if (validateData.name !== undefined) updateData.name = validateData.name;
      if (validateData.description !== undefined) updateData.description = validateData.description;
      if (validateData.initial_stock !== undefined) updateData.initial_stock = validateData.initial_stock;
      if (validateData.availabel_stock !== undefined) updateData.available_stock = validateData.availabel_stock;
      if(validateData.categoryId !==undefined) updateData.categoryId = validateData.categoryId
      if (newImageFilename) updateData.image = newImageFilename;
  
      // Perform database update
      await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, Number(id)))
        
  
      if (oldImageFilename) {
        const oldImagePath = path.join(
          process.cwd(),
          'public/assets',
          oldImageFilename
        );
        await unlink(oldImagePath);
      }
      return Response.json({message : "Product updated successfully"},{status:200})
  
    } catch (error) {
        console.error(error);

        // Clean up new image if update failed
        if (newImageFilename) {
          const newImagePath = path.join(
            process.cwd(),
            'public/assets',
            newImageFilename
          );
          await unlink(newImagePath).catch(console.error);
        }

        return Response.json({message : "Failed to update product"},{status:500})
    }
}