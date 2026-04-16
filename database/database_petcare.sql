-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.medical_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  patient_id uuid,
  treatment_date date NOT NULL,
  doctor_name text,
  treatment_type text,
  weight_kg numeric,
  diagnosis_notes text,
  CONSTRAINT medical_records_pkey PRIMARY KEY (id),
  CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  full_name text NOT NULL,
  phone text,
  email text,
  address text,
  CONSTRAINT owners_pkey PRIMARY KEY (id)
);
CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  owner_id uuid,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  gender text,
  color_marks text,
  birth_date date,
  photo_url text,
  CONSTRAINT patients_pkey PRIMARY KEY (id),
  CONSTRAINT patients_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owners(id)
);
CREATE TABLE public.reminder_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nama_hewan text NOT NULL,
  nama_pemilik text NOT NULL,
  jenis_vaksin text NOT NULL,
  channel text DEFAULT 'WhatsApp'::text,
  status text DEFAULT 'Terkirim'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reminder_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reminder_settings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  h7_active boolean,
  h3_active boolean,
  h1_active boolean,
  late_active boolean,
  activation_active boolean,
  updated_at timestamp with time zone,
  CONSTRAINT reminder_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vaccination_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  vaccine_name text,
  next_vaccine_date date,
  status text DEFAULT 'scheduled'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vaccination_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT vaccination_schedules_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.vaksin (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_produk text NOT NULL,
  kategori_hewan text,
  stok_sekarang integer,
  stok_minimal integer,
  harga bigint,
  tanggal_kadaluarsa date,
  CONSTRAINT vaksin_pkey PRIMARY KEY (id)
);