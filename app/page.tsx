'use client';

import { useState } from 'react';
import { CourseCard } from "@/components/course-card";
import { featuredCourses, Course } from "@/data/courses";
import { CourseManagementModal } from "@/components/course-management/course-management-modal";

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>(featuredCourses);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12 md:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-brand-700/40 blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            Plataforma de cursos online
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Aprende habilidades modernas con rutas prácticas
          </h1>
          <p className="mb-8 text-lg text-slate-200">
            Catálogo curado de cursos para desarrollo web, diseño y productividad.
            Todo en una experiencia rápida con Next.js y Tailwind.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Explorar cursos
            </button>
            <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20">
              Ver demo
            </button>
            <button 
              onClick={() => setIsManagementModalOpen(true)}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20"
            >
              Manage Courses
            </button>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Cursos destacados</h2>
            <p className="mt-1 text-slate-600">
              Comienza hoy con contenido actualizado y proyectos guiados.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
            {featuredCourses.length} resultados
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <CourseManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        courses={courses}
        onCoursesUpdate={setCourses}
      />
    </main>
  );
}
