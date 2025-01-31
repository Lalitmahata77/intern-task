ALTER TABLE "products" DROP CONSTRAINT "products_category_Id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "category_Id";