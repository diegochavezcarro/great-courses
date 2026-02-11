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
