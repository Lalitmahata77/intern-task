ALTER TABLE "products" DROP CONSTRAINT "products_category_Id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_Id_categories_id_fk" FOREIGN KEY ("category_Id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE cascade;