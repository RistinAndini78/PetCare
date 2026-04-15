import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

    return createServerClient(
    "https://ahmennbfapwlwmbvekuu.supabase.co",    // <-- Ganti pakai string URL asli (pakai tanda kutip)
    "sb_publishable_pyc7UsNEzSfga1tNB7Xekw_9uKfwSTy", // <-- Ganti pakai string Key asli (pakai tanda kutip)
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Error ini diabaikan karena Server Component 
            // memang tidak diizinkan mengubah cookie secara langsung.
          }
        },
      },
    }
  )
}