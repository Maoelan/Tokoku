import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Configuring Supabase Storage Bucket 'products'...");
    
    // 1. Create bucket and make it public
    await db.execute(sql`
      insert into storage.buckets (id, name, public)
      values ('products', 'products', true)
      on conflict (id) do update set public = true;
    `);
    console.log("Bucket configured.");

    // 2. Create policies
    // Allow public read access
    await db.execute(sql`
      do $$
      begin
        if not exists (
            select 1 from pg_policies where policyname = 'Public Access' and tablename = 'objects' and schemaname = 'storage'
        ) then
            create policy "Public Access" on storage.objects for select to public using (bucket_id = 'products');
        end if;
      end
      $$;
    `);

    // Allow public insert access
    await db.execute(sql`
      do $$
      begin
        if not exists (
            select 1 from pg_policies where policyname = 'Public Insert' and tablename = 'objects' and schemaname = 'storage'
        ) then
            create policy "Public Insert" on storage.objects for insert to public with check (bucket_id = 'products');
        end if;
      end
      $$;
    `);

    // Allow public update/delete access just in case
    await db.execute(sql`
      do $$
      begin
        if not exists (
            select 1 from pg_policies where policyname = 'Public Update' and tablename = 'objects' and schemaname = 'storage'
        ) then
            create policy "Public Update" on storage.objects for update to public with check (bucket_id = 'products');
        end if;

        if not exists (
            select 1 from pg_policies where policyname = 'Public Delete' and tablename = 'objects' and schemaname = 'storage'
        ) then
            create policy "Public Delete" on storage.objects for delete to public using (bucket_id = 'products');
        end if;
      end
      $$;
    `);

    console.log("✅ Supabase Storage policies applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to setup storage:", error);
    process.exit(1);
  }
}

main();
