CREATE TABLE IF NOT EXISTS public.clinic_profile (
  id bigint PRIMARY KEY DEFAULT 1,
  nama_klinik text,
  jam_operasional text,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default data if not exists
INSERT INTO public.clinic_profile (id, nama_klinik, jam_operasional)
SELECT 1, 'PetCare Clinic', 'Senin - Jumat: 08:00 - 20:00\nSabtu - Minggu: 09:00 - 17:00'
WHERE NOT EXISTS (SELECT 1 FROM public.clinic_profile WHERE id = 1);
