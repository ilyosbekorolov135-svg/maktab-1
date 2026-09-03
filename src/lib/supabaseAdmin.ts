/**
 * supabaseAdmin.ts
 * Supabase Storage ga fayllar (rasm va video) yuklash uchun storage client.
 */
import { StorageClient } from '@supabase/storage-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

export function getStorageClient(): StorageClient {
  const storageUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1`;
  return new StorageClient(storageUrl, {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  });
}

/** Fayl yuklash va public URL qaytarish */
export async function uploadFileToStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string = 'images'
): Promise<string> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL yoki SUPABASE_SERVICE_KEY .env faylda belgilanmagan');
  }

  const storage = getStorageClient();
  const ext = originalName.split('.').pop() || 'jpg';
  const unique = Date.now() + '-' + Math.round(Math.random() * 1000000000);
  const fileName = folder + '/' + unique + '.' + ext;

  const { error } = await storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error('Supabase Storage xatosi: ' + error.message);
  }

  const { data } = storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}