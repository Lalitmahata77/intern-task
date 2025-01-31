import { db } from "@/lib/db/db"
import { categories } from "@/lib/db/schema"
import { categorySchema } from "@/lib/validators/categorySchema"
import { eq } from "drizzle-orm"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

export async function GET(request:Request, {params} : {params :{id : string}}){
    const id = params.id
    try {
        const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id,Number(id)))
        .limit(1)
        if (!category.length) {
            return Response.json({message : "Category not found"},{status:400})
        }

        return Response.json(category[0])
        
    } catch (error) {
        console.log(error);
        
        return Response.json({message : "Failed to fetch a product"},{status:500})
    }
}
export async function DELETE(request:Request, {params} : {params : {id : string}}){
    const id = params.id;
    try {
        const categoryResult = await db
        .select()
        .from(categories)
        .where(eq(categories.id, Number(id)))
        .limit(1)

        if (!categoryResult.length) {
            return Response.json({message : "Product not found"},{status:400})
        }
        const category = categoryResult[0];

        await db.delete(categories).where(eq(categories.id, Number(id)))
        if (category.image) {
            const imagePath = path.join(
              process.cwd(),
              'public/assets',
              category.image
            );
            await unlink(imagePath);
          }


    } catch (error) {
        console.log(error);
        
        return Response.json({message : "Failed to delete a Category"},{status:500})

    }
}

export async function PUT(request:Request, {params} : {params : {id : string}}){
    const id = params.id
    let newImageFilename: string | undefined;
  let oldImageFilename: string | undefined;
    try {
        const existingCategory = await db.select().from(categories).where(eq(categories.id,Number(id))).limit(1)
        if (!existingCategory.length) {
            return Response.json({message : "Product not found"},{status:404})
        }
 const data = await request.formData()
    let validateData;
    try {
        validateData = categorySchema.parse({
            name : data.get('name'),
            image : data.get('image'),
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
  
        oldImageFilename = existingCategory.image ;
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
      if (newImageFilename) updateData.image = newImageFilename;
  
      // Perform database update
      await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, Number(id)))
        
  
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