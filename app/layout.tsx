import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Great Courses | Aprende habilidades modernas",
  description:
    "Plataforma demo de cursos en Next.js + Tailwind para explorar rutas de aprendizaje.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
