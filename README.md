# Great Courses (Next.js + Tailwind)

Aplicación de cursos creada con **Next.js moderno (App Router)** y **Tailwind CSS**.

## Requisitos

- Node.js 18.18+ (recomendado Node.js 20)
- npm 9+

## Comandos para levantarlo en local

```bash
# 1) Instalar dependencias
npm install

# 2) Levantar servidor de desarrollo
npm run dev
```

La aplicación estará en: `http://localhost:3000`

## Comandos útiles

```bash
# Ejecutar lint
npm run lint

# Crear build de producción
npm run build

# Correr build en modo producción
npm run start
```

## Solución de problemas (npm 403 con proxy)

Si ves un error similar a `403 Forbidden - GET https://registry.npmjs.org/...`, revisa si estás detrás de un proxy corporativo o una política de red restrictiva.

```bash
# Ver registro actual
npm config get registry

# Limpiar proxy en npm (si aplica)
npm config delete proxy
npm config delete https-proxy

# Opcional: limpiar variables de entorno proxy en la sesión actual
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy npm_config_http_proxy npm_config_https_proxy

# Reintentar instalación
npm install
```
## Course Schema

The application manages courses with the following structure:

```typescript
interface Course {
  id: string;           // Unique identifier (auto-generated from title)
  title: string;        // Course title (e.g., "Next.js Bootcamp 2026")
  teacher: string;      // Instructor name (e.g., "Dr. Sarah Johnson")
  category: string;     // Course category (e.g., "Web Development")
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  lessons: number;      // Number of lessons
  duration: string;     // Duration (e.g., "40 horas")
  rating: number;       // Rating (0-5)
  description: string;  // Course description
  tags: string[];       // Searchable tags
}
```

### Validation Rules

- **Title**: Required, 3-100 characters, unique
- **Teacher**: Required, 2-100 characters
- **Category**: Required, 2-50 characters
- **Level**: Required, must be one of: Principiante, Intermedio, Avanzado
- **Lessons**: Required, positive integer
- **Duration**: Required, must include "horas", "días", "semanas", or "meses"
- **Rating**: Optional, 0-5
- **Description**: Required, 10-500 characters
- **Tags**: Optional array of strings

### Features

- ✅ Course display in responsive card layout
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Search by title, teacher, description, or tags
- ✅ Filter by category and level
- ✅ Teacher assignment and display
- ✅ Form validation with error messages
- ✅ Migration support for existing courses