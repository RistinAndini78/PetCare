import { createClient } from '@/utils/supabase/server'

export default async function TestDBPage() {
  // 1. Memanggil koneksi Supabase
  const supabase = await createClient()

  // 2. Mengambil data dari tabel 'hewan' di Supabase
  const { data: patientsList, error } = await supabase.from('patients').select('*')

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Koneksi Gagal ❌</h2>
        <p>Pesan Error: {error.message}</p>
      </div>
    )
  }

  // 3. Menampilkan data ke layar
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'green' }}>Koneksi Berhasil! ✅</h1>
      <h2>Daftar Pasien PetCare dari Supabase:</h2>
      <ul>
        {patientsList?.map((hewan) => (
          <li key={hewan.id} style={{ marginBottom: '10px' }}>
            🐶 <strong>Nama:</strong> {hewan.nama} | <strong>Jenis:</strong> {hewan.jenis}
          </li>
        ))}
      </ul>
    </div>
  )
}
