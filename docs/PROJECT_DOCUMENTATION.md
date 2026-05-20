# PetCare — Project Documentation (Very Complete)

> Tujuan dokumen ini: menjadi **panduan kerja** untuk semua developer agar paham bagaimana PetCare bekerja dari sisi arsitektur, alur user/admin, skema database yang digunakan, integrasi WhatsApp, sampai cara menambah fitur baru.

---

## 1) Ringkasan Project

**PetCare** adalah aplikasi web berbasis **Next.js (App Router)** untuk:

1. **Portal Pemilik Hewan (Owner/Pemilik):**
   - Login memakai **Nomor WhatsApp + Password** (password dikelola di tabel `owners`).
   - Melihat **dashboard/beranda**, daftar hewan (`patients`), jadwal vaksin (`vaccination_schedules`), riwayat medis (`medical_records`), notifikasi, profil, serta fitur konsultasi dokter.

2. **Portal Admin (Staf Klinik):**
   - Login admin memakai **Supabase Auth** (`auth.signInWithPassword`).
   - Mengelola data: pasien, pemilik, rekam medis, stok vaksin, operasional, staf, pengaturan akun/keamanan.
   - Fitur khusus: **pengingat vaksin via WhatsApp** yang dikirim otomatis dan tercatat pada `reminder_logs`.

3. **AI Diagnosa Awal (Opsional/Fitur API):**
   - Endpoint `/api/chat` menggunakan **Gemini API** untuk memberikan diagnosa awal.

---

## 2) Tech Stack

- **Next.js**: v16.2.1 (App Router)
- **React**: 19.2.4
- **TypeScript**
- **Supabase**
  - Client-side: `@supabase/ssr` (`createBrowserClient`)
  - Server-side: `@supabase/ssr` (`createServerClient`)
  - Admin auth: `supabase.auth.signInWithPassword()`
- **WhatsApp Gateway**: Evolution API (`/api/send-wa` dan cron reminder)
- **AI**: Google Generative Language API (Gemini)
- Styling:
  - Banyak komponen memakai **styled-jsx**
  - Ada custom global CSS `src/app/custom-styles.css`
  - Beberapa komponen memakai utilitas class berbasis CSS variables.

---

## 3) Arsitektur High-Level

### 3.1 Struktur Utama
- **UI**: `src/app/**/page.tsx` (halaman)
- **Reusable Components**: `src/components/**`
- **Data Access**:
  - Client: `src/utils/supabase/client.ts`
  - Middleware/Server client: `src/utils/supabase/server.ts` (dan `middleware.ts`)
- **Backend API (Route Handler)**: `src/app/api/**/route.ts`

### 3.2 Pola Rendering
- Banyak page memakai `use client` (client-side fetching dengan Supabase browser client).
- `layout.tsx` menggunakan registry `styled-jsx` agar style tidak hilang saat SSR.

---

## 4) Struktur Folder (App Router)

Berikut pola folder yang dipakai:

### 4.1 Public / Landing
- `src/app/page.tsx`
  - Menampilkan pilihan portal:
    - `/login/user`
    - `/login/admin`

### 4.2 Owner Portal
- `src/app/login/user/page.tsx` — Login owner
- `src/app/beranda/page.tsx` — Beranda owner
- `src/app/hewan-saya/page.tsx` — Daftar hewan owner (with status vaksin)
- `src/app/rekam-medis/page.tsx` — Timeline rekam medis owner (per hewan)
- `src/app/konsultasi/page.tsx` — List dokter untuk chat WA
- `src/app/notifikasi/page.tsx` — Ringkasan notifikasi (vaksin & rekam medis)
- `src/app/profil/page.tsx`, `src/app/profil/edit/page.tsx`, `src/app/profil/ganti-password/page.tsx`
- `src/app/rekam-medis/detail/page.tsx` — detail grafik (dipakai di halaman admin & owner)

### 4.3 Admin Portal
- `src/app/login/admin/page.tsx` — Login admin (Supabase Auth)
- `src/app/admin/beranda/page.tsx` — Dashboard operasional
- `src/app/admin/pasien/**` — CRUD pasien (termasuk detail `[id]`)
- `src/app/admin/pemilik/**` — CRUD pemilik
- `src/app/admin/rekam-medis/**` — CRUD rekam medis
- `src/app/admin/vaksin/**` — Stok vaksin & tambah
- `src/app/admin/reminder/page.tsx` — Pengaturan & log reminder + trigger manual
- `src/app/admin/pengaturan/**` — Profil klinik, akun, keamanan, staf
- `src/app/admin/operasional/**` — jam operasional

---

## 5) Komponen Reusable

### 5.1 `BrandLogo`
**File:** `src/components/BrandLogo.tsx`

- Props:
  - `size`: `small | medium | large | xl` (default `xl`)
  - `className`
- Memetakan ukuran dengan `sizeMap` dan menampilkan SVG logo.

Dipakai pada:
- `AdminSidebar`
- halaman login admin/user
- halaman lain sebagai identitas.

### 5.2 `BottomNav`
**File:** `src/components/BottomNav.tsx`

- Menampilkan navigasi mobile untuk owner.
- Menggunakan `usePathname()` untuk menentukan item aktif.
- Nav items:
  - `/beranda`, `/hewan-saya`, `/rekam-medis`, `/konsultasi`, `/profil`.

### 5.3 `UserHeader`
**File:** `src/components/UserHeader.tsx`

- Header hero gradient untuk owner.
- Memiliki tombol notifikasi yang push ke `/notifikasi`.

### 5.4 `AdminSidebar`
**File:** `src/components/AdminSidebar.tsx`

- Sidebar fixed dengan menu:
  - beranda, pasien, rekam-medis, pemilik, vaksin, reminder, pengaturan
- Menggunakan `localStorage` key `petcare_user` untuk menampilkan nama/role admin.
- Logout:
  - `supabase.auth.signOut()`
  - hapus `petcare_user`
  - redirect ke `/login/admin`

### 5.5 `AdminTopbar`
**File:** `src/components/AdminTopbar.tsx`

- Topbar sticky admin.
- Props:
  - `title`, `subtitle`, `name`, `onSearch`, `backUrl`
- Bila `onSearch` ada, muncul input search.

### 5.6 `SettingsSidebar`
**File:** `src/components/SettingsSidebar.tsx`

- Sidebar sekunder untuk menu pengaturan admin:
  - Profil Klinik
  - Staf
  - Akun Saya
  - Keamanan
- Menentukan state active berdasarkan `usePathname()`.

### 5.7 `StatCard`
**File:** `src/components/StatCard.tsx`

- Komponen kartu statistik.
- Props:
  - `label`, `value`, `sub`
  - `type`: default | red | green | blue | yellow
  - `gridSpan`: untuk memperlebar kolom

---

## 6) Supabase Integration

### 6.1 Client-side Supabase Client
**File:** `src/utils/supabase/client.ts`

- Mengekspor `createClient()` yang membungkus:
  - `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`

Catatan:
- Banyak page memakai `const supabase = createClient();` lalu memanggil `.from('table').select()/update()/insert()`.

### 6.2 Server-side Supabase Client
**File:** `src/utils/supabase/server.ts`

- `createServerClient` + `cookies` untuk SSR.
- Penting untuk middleware/cookie agar session terjaga.

### 6.3 Authentication Pattern

#### Admin
- Login ada di `src/app/login/admin/page.tsx`:
  - `supabase.auth.signInWithPassword({email, password})`
  - lalu membuat “sessionData” sederhana untuk UI:
    - simpan ke `localStorage` key `petcare_user`.
- Halaman admin memvalidasi session Supabase:
  - contoh `admin/beranda/page.tsx` memanggil `supabase.auth.getSession()`.

#### Owner
- Login owner ada di `src/app/login/user/page.tsx`:
  - mencari owner berdasar `owners.phone` (varian format WA disamakan)
  - mengambil field `password` dari database
  - jika cocok: simpan ke `localStorage` key `petcare_owner`.
- Owner pages memakai `petcare_owner` untuk `ownerSession.id`.

---

## 7) Database (Skema yang digunakan)

Skema referensi terdapat di:
- `database/database_petcare.sql`
- folder `database/migrations/` (migrasi bertanggal)

Dari `database_petcare.sql`, tabel yang digunakan (minimal):

1. `owners`
   - `id`, `full_name`, `phone`, `email`, `address`, `password` (password ada pada migrasi 2026-04-22)

2. `patients`
   - `id`, `owner_id` (FK -> owners)
   - `name`, `species`, `breed`, `gender`, `birth_date`, dst.

3. `vaccination_schedules`
   - `patient_id` (FK -> patients)
   - `vaccine_name`, `next_vaccine_date`, `status` (default `scheduled`)

4. `medical_records`
   - `patient_id` (FK -> patients)
   - `treatment_date`, `treatment_type`, `doctor_name`, `weight_kg`, `diagnosis_notes`

5. `reminder_settings`
   - `h7_active`, `h3_active`, `h1_active`, `late_active`, `activation_active`

6. `reminder_logs`
   - catatan pengiriman reminder ke WA:
     - `nama_hewan`, `nama_pemilik`, `jenis_vaksin`, `channel`, `status`, `created_at`

7. `vaksin`
   - stok vaksin

---

## 8) WhatsApp Gateway & Reminder Cron

### 8.1 Gateway kirim pesan
**File:** `src/app/api/send-wa/route.ts`

- Exposes endpoint: **POST** dengan body `{ phone, message }`.
- Flow:
  1. Ambil env:
     - `EVOLUTION_API_URL`
     - `EVOLUTION_API_KEY`
     - `EVOLUTION_INSTANCE_NAME`
  2. Normalisasi nomor:
     - ubah ke format e.164 tanpa plus: `62...`
  3. Kirim request ke Evolution:
     - `POST {EVOLUTION_API_URL}/message/sendText/{instanceName}`
  4. Jika gagal, fallback ke Fonnte bila `FONNTE_TOKEN` ada.

### 8.2 Cron Reminder
Ada beberapa endpoint cron.

#### (A) `/api/cron/send-reminders`
**File:** `src/app/api/cron/send-reminders/route.ts`

- Method: **GET**
- Tujuan: kirim reminder terjadwal berdasarkan `reminder_settings`.
- Query:
  - Reminder H-7 / H-3 / H-1 (menggunakan `next_vaccine_date`) dengan `status='scheduled'`
  - Late reminder: `next_vaccine_date < todayStr` + `status='scheduled'`
- Pengiriman:
  - Membentuk teks pesan sesuai tipe `h7/h3/h1/late`
  - Memanggil `sendWA()` yang melakukan POST ke Evolution API.
- Logging:
  - Setelah sukses, insert ke `reminder_logs`.

#### (B) `/api/cron`
**File:** `src/app/api/cron/route.ts`

- Endpoint ini tampak versi/implementasi lama/alternate.
- Berisi logika yang mirip tapi menggunakan tabel/struktur berbeda (`pasien_vaksin`).

> Developer note: bila ada dua endpoint cron, pastikan UI men-trigger yang benar.
> Pada file admin reminder terlihat UI memanggil `/api/cron/send-reminders`.

---

## 9) AI Endpoint (Gemini)

**File:** `src/app/api/chat/route.ts`

- Method:
  - GET: mengembalikan status
  - POST: menerima body `{ message }`
- Menggunakan env `GEMINI_API_KEY`
- Membentuk `systemPrompt` yang mengarahkan model:
  - diagnosa awal berdasarkan gejala
  - ramah & informatif
  - tidak memberikan resep obat keras langsung
  - output ringkas (2–3 paragraf)
- Mengembalikan JSON: `{ reply: text }`

---

## 10) Dokumentasi Page (Pola + Detail Penting)

Di bagian ini, dokumen menjelaskan **cara kerja** tiap page yang ditemukan, termasuk state, query, dan navigasi.

### 10.1 Landing / Portal Selection
**File:** `src/app/page.tsx`

- Menampilkan 2 kartu:
  - Pemilik Hewan -> `/login/user`
  - Staf Klinik -> `/login/admin`

### 10.2 Owner Login
**File:** `src/app/login/user/page.tsx`

- State:
  - `wa` nomor WhatsApp
  - `pass` password
  - `showPass` toggling visibility
  - `loading`

- Normalisasi WA:
  - `normalizeWaDigits` menghapus non-digit
  - `toWaVariants` menghasilkan beberapa kemungkinan format (misal 08..., 62..., +62...)

- Query ke Supabase:
  - `owners` select `id, full_name, phone, email, address, created_at, password`
  - `.in('phone', variants)`

- Validasi:
  - cocokkan password input dengan `ownerMatch.password`

- Session:
  - simpan `localStorage['petcare_owner'] = {id, full_name, phone, email}`
  - redirect ke `/beranda`

### 10.3 Admin Login
**File:** `src/app/login/admin/page.tsx`

- State:
  - `emailInput`, `pass`, `showPass`, `isLoading`, `errorMsg`

- Login:
  - `supabase.auth.signInWithPassword({ email, password })`

- UI Session:
  - simpan ke `localStorage['petcare_user']`:
    - `{ id, name: 'Admin Utama', role:'admin' }`
  - redirect `/admin/beranda`

### 10.4 Owner Home (Beranda)
**File:** `src/app/beranda/page.tsx`

- Menggunakan `localStorage['petcare_owner']` sebagai sumber utama session.
- Fallback: mencoba `supabase.auth.getUser()` bila memakai auth.
- Query:
  1. Ambil owner:
     - `.from('owners').eq('id', ownerSession.id).single()`
     - atau `.eq('email', user.email).single()`
  2. Ambil patients milik owner:
     - `.from('patients').eq('owner_id', owner.id)`
  3. Ambil vaccination_schedules terdekat per patient:
     - `.from('vaccination_schedules').in('patient_id', ids).eq('status','scheduled')`
     - lalu mapping “next schedule” per patient.

- UI:
  - kartu tiap hewan dengan badge status:
    - “Vaksin Telat”
    - “Vaksin H-X”
    - “Sehat”

### 10.5 Owner Hewan Saya
**File:** `src/app/hewan-saya/page.tsx`

- Query:
  - patients by owner_id
  - vaccination_schedules status scheduled, per patient
  - medical_records untuk mengambil berat terakhir (`weight_kg`)

- Komputasi:
  - umur dari `birth_date` (format bulan/tahun)
  - status vaksin:
    - diffDays <= 0 => urgent telat
    - diffDays <= 7 => urgent H-x
    - else aman

### 10.6 Owner Riwayat Medis (Timeline)
**File:** `src/app/rekam-medis/page.tsx`

- State:
  - `pets[]`, `selectedPetId`
  - `timeline[]`
  - `upcoming` (jadwal vaksin berikutnya)

- Flow:
  1. Load pets owner
  2. Ketika `selectedPetId` berubah, load:
     - medical_records order treatment_date desc
     - vaksin berikutnya:
       - `vaccination_schedules .eq(patient_id).eq(status,'scheduled').order(next_vaccine_date).limit(1)`

- Transform:
  - treatment_type yang mengandung kata “vaksin” ditampilkan spesial sebagai `Vaksin {nama vaksin}`
  - diagnosis_notes dibersihkan/diambil bagian relevan.

### 10.7 Owner Konsultasi
**File:** `src/app/konsultasi/page.tsx`

- Query:
  - `.from('staf').select('id, full_name, role, whatsapp, status')`
  - filter:
    - `role` ilike `%dokter%`
    - `status in ['Aktif','Sibuk']`

- Mapping:
  - status online/busy
  - membuat link WhatsApp:
    - `https://wa.me/{phone}?text={message}`

### 10.8 Owner Notifikasi
**File:** `src/app/notifikasi/page.tsx`

- Query:
  - ambil patients milik owner
  - ambil vaccination_schedules scheduled dalam 7 hari ke depan
  - ambil medical_records dalam 7 hari terakhir (limit 3)

- Transform:
  - jadikan masing-masing item menjadi `Notification` dengan:
    - `type: vaccine | info | success`
    - `time` berupa relative string

- Interaksi:
  - klik notifikasi -> `markAsRead` (hanya state lokal, belum insert ke DB).

### 10.9 Admin Dashboard (Beranda Operasional)
**File:** `src/app/admin/beranda/page.tsx`

- `export const dynamic = 'force-dynamic';` untuk menghindari cache.
- Validasi session admin:
  - `supabase.auth.getSession()`
  - jika tidak ada: hapus localStorage & redirect `/login/admin`

- Query:
  1. `patients`:
     - `.select('*, owners(full_name)', { count:'exact' })`
     - limit 5 untuk tabel pasien baru
  2. `vaccination_schedules`:
     - `.eq('status','scheduled').order(next_vaccine_date)`
     - hitung due reminder `s.next_vaccine_date <= todayStr`
     - tampilkan 5 reminder terdekat.
  3. grafik 7 hari terakhir:
     - hitung range tanggal terakhir 7 hari
     - ambil `medical_records` dan hitung jumlah berdasarkan prefix tanggal.

- UI:
  - metrics grid (Total Pasien, Jatuh Tempo, Chart Kunjungan)
  - tabel pasien baru
  - panel reminder
  - link ke `/admin/pasien/tambah` dan `/admin/reminder`.

### 10.10 Admin Reminder (Pengaturan & Trigger)
**File:** `src/app/admin/reminder/page.tsx`

- State:
  - `toggles` untuk setting reminder
  - `logs` (last 10)
  - `isProcessing` saat trigger

- Real-time:
  - subscribe channel `'realtime-reminder-logs'` pada table `reminder_logs` event INSERT
  - bila insert -> refresh settings & logs

- Load data:
  - fetch `reminder_settings` row `id=1`
  - fetch `reminder_logs` limit 10 order created_at desc

- Trigger manual:
  - `runReminder()` melakukan `fetch('/api/cron/send-reminders')`
  - jika sukses alert dan refresh.

- Toggle:
  - toggle handler mengupsert ke `reminder_settings` dengan kolom `<key>_active`.

### 10.11 Profil Klinik (Settings)
**File:** `src/app/admin/pengaturan/page.tsx`

- Mengambil `clinic_profile` `id=1`.
- Mode:
  - lihat
  - edit dengan tombol (mengubah `isEditing`)
- Simpan:
  - `upsert({ id:1, nama_klinik, jam_operasional })`
- Batal edit:
  - restore `tempData`.

### 10.12 Data lain
Page admin lain mengikuti pola serupa:
- CRUD via Supabase (`insert/update/delete`)
- tabel dengan search
- menggunakan `AdminSidebar` dan `AdminTopbar` untuk layout.

---

## 11) Environment Variables (Wajib Dicek)

Berdasarkan kode, env yang diperlukan antara lain:

### 11.1 Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (untuk server-side cron gateway)
- `SUPABASE_SERVICE_ROLE_KEY`

### 11.2 WhatsApp Evolution Gateway
- `EVOLUTION_API_URL`
- `EVOLUTION_INSTANCE_NAME`
- `EVOLUTION_API_KEY`

### 11.3 Optional Fallback
- `FONNTE_TOKEN`

### 11.4 AI
- `GEMINI_API_KEY`

> Pastikan semua env ada di `.env.local` saat develop.

---

## 12) Daftar Endpoint API

1. `POST /api/send-wa`
   - body: `{ phone, message }`
   - mengirim WA melalui Evolution atau fallback Fonnte.

2. `GET /api/cron/send-reminders`
   - mengirim reminder berdasarkan `reminder_settings` dan menulis `reminder_logs`.

3. `GET/POST /api/chat`
   - AI chat diagnostik awal.

4. `GET /api/cron`
   - endpoint cron alternatif/versi lain (gunakan hati-hati).

---

## 13) Guideline Kontribusi (Cara Kerja Developer)

### 13.1 Menambah fitur Owner
Pola umum:
1. Pastikan session owner tersedia di `localStorage['petcare_owner']`.
2. Ambil `owner.id`.
3. Query berdasarkan owner_id -> patients.
4. Ambil data turunan (jadwal vaksin, medical records, dll).
5. Pastikan UI menghandle state:
   - loading
   - empty data
   - error

### 13.2 Menambah fitur Admin
Pola umum:
1. Pastikan page admin memvalidasi session Supabase (contoh di admin/beranda).
2. Gunakan `AdminSidebar` untuk konsistensi navigasi.
3. Gunakan `AdminTopbar` untuk topbar dan search (jika diperlukan).
4. Query Supabase pada tabel terkait (lihat skema).
5. Bila ada perubahan reminder, pastikan trigger atau realtime update sesuai.

### 13.3 Praktik Terkait Data
- Hindari membuat asumsi struktur table di frontend tanpa doc.
- Jika menambah kolom baru di DB:
  - update juga UI transform mapping.

---

## 14) Catatan Penting / Risiko Teknis (Untuk Developer)

1. **Auth Owner tidak memakai Supabase Auth**
   - Owner menggunakan login berbasis `owners.password` dan localStorage.
   - Ini memerlukan perhatian keamanan (password tersimpan di DB dan dibandingkan di frontend).

2. **Ada dua endpoint cron** (`/api/cron` dan `/api/cron/send-reminders`)
   - UI reminder sudah mengarah ke `/api/cron/send-reminders`.
   - Developer harus konsisten menggunakan endpoint yang benar.

3. **markAsRead hanya state lokal**
   - `notifikasi/page.tsx` tidak menandai read ke database.

4. **Type safety**
   - Banyak page menggunakan `any[]` saat mapping data.
   - Idealnya developer memperketat typing saat melakukan refactor.

---

## 15) Checklist Tim Developer (Saat Mengerjakan Task)

Sebelum mulai kerja, lakukan:
- [ ] Pahami apakah fitur masuk Owner atau Admin.
- [ ] Lacak tabel Supabase yang relevan (lihat database_petcare.sql).
- [ ] Pastikan route API yang dipakai sesuai (terutama cron).
- [ ] Ikuti komponen layout standar (AdminSidebar/AdminTopbar/BottomNav/UserHeader).
- [ ] Tambahkan state loading & empty.

---

## 16) Lampiran: Referensi File Utama

- Landing: `src/app/page.tsx`
- Owner:
  - `src/app/login/user/page.tsx`
  - `src/app/beranda/page.tsx`
  - `src/app/hewan-saya/page.tsx`
  - `src/app/rekam-medis/page.tsx`
  - `src/app/konsultasi/page.tsx`
  - `src/app/notifikasi/page.tsx`
- Admin:
  - `src/app/login/admin/page.tsx`
  - `src/app/admin/beranda/page.tsx`
  - `src/app/admin/reminder/page.tsx`
  - `src/app/admin/pengaturan/page.tsx`
- API:
  - `src/app/api/send-wa/route.ts`
  - `src/app/api/cron/send-reminders/route.ts`
  - `src/app/api/chat/route.ts`

---

## Penutup
Dokumentasi ini dibuat agar developer bisa memahami PetCare secara end-to-end.

> Catatan: karena jumlah page & skenario bisa bertambah, dokumentasi ini disarankan untuk terus diperbarui mengikuti evolusi fitur baru (CRUD tambahan, perubahan skema DB, dsb.).

