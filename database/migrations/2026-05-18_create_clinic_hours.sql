CREATE TABLE public.clinic_hours (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_label text NOT NULL,
  open_time text NOT NULL,
  close_time text NOT NULL,
  CONSTRAINT clinic_hours_pkey PRIMARY KEY (id)
);

-- Insert default data
INSERT INTO public.clinic_hours (day_label, open_time, close_time) VALUES
('Senin - Jumat', '08:00 AM', '08:00 PM'),
('Sabtu', '09:00 AM', '06:00 PM'),
('Minggu', '09:00 AM', '06:00 PM');
