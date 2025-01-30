// Make sure to install the 'postgres' package
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
 const queryString = process.env.DATABASE_URL as string
export const queryClient = postgres(queryString);
export const db = drizzle({ client: queryClient });

// const result = await db.execute('select 1');
// 7YSq$sLc-9Mdqf8
// postgresql://postgres:[YOUR-PASSWORD]@db.sobuzebrtjpokrvewaqd.supabase.co:5432/postgres
