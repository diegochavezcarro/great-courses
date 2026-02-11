export type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";

export type Course = {
  id: string;
  title: string;
  category: string;
  level: CourseLevel;
  lessons: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
};

export const featuredCourses: Course[] = [
  {
    id: "nextjs-bootcamp",
    title: "Next.js Bootcamp 2026",
    category: "Desarrollo Web",
    level: "Intermedio",
    lessons: 24,
    duration: "14 horas",
    rating: 4.9,
    description:
      "Construye aplicaciones fullstack con App Router, Server Actions y despliegue optimizado.",
    tags: ["Next.js", "TypeScript", "SSR"],
  },
  {
    id: "tailwind-design-system",
    title: "Tailwind + Design Systems",
    category: "UI/UX",
    level: "Principiante",
    lessons: 18,
    duration: "9 horas",
    rating: 4.8,
    description:
      "Aprende a escalar interfaces reutilizables con componentes consistentes y accesibles.",
    tags: ["Tailwind", "Accesibilidad", "Componentes"],
  },
  {
    id: "ia-productividad",
    title: "IA para Productividad Profesional",
    category: "Productividad",
    level: "Principiante",
    lessons: 12,
    duration: "6 horas",
    rating: 4.7,
    description:
      "Integra herramientas de IA en tu flujo diario para investigar, escribir y automatizar tareas.",
    tags: ["IA", "Automatización", "Flujos"],
  },
];
