import { Course } from "@/data/courses";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">
          {course.category}
        </span>
        <span className="text-slate-500">⭐ {course.rating.toFixed(1)}</span>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-slate-900">{course.title}</h3>
      
      <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>{course.teacher}</span>
      </div>
      
      <p className="mb-5 text-sm leading-relaxed text-slate-600">{course.description}</p>

      <ul className="mb-6 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            #{tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{course.lessons} lecciones</span>
        <span>{course.duration}</span>
        <span className="font-medium text-brand-700">{course.level}</span>
      </div>
    </article>
  );
}
