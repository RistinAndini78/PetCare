import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./custom-styles.css";
import StyledJsxRegistry from "./registry";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "PetCare — Selamat Datang",
  description: "PetCare Smart - Pilih portal untuk melanjutkan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>
        <StyledJsxRegistry>
          {children}
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
