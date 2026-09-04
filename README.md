# Gestor de Proyectos y Tareas

**Taskflow** es una Single Page Application (SPA) diseñada para organizar, gestionar y dar seguimiento a proyectos y sus respectivas tareas. 

Resuelve el problema de la desorganización de cargas de trabajo centralizando la información en una interfaz limpia, intuitiva y con una estética altamente cuidada. Permite a los usuarios visualizar el estado de sus proyectos, asignar prioridades, establecer fechas límite y actualizar el flujo de trabajo en tiempo real mediante un sistema CRUD completo.

## Tecnologías Utilizadas

*   **Core:** React 18, Vite, TypeScript.
*   **Estilos y UI:** Material UI (MUI) v5.
*   **Enrutamiento:** React Router DOM v6.
*   **Peticiones HTTP:** Axios.
*   **Autenticación:** JSON Web Tokens (JWT).
*   **CI/CD y Despliegue:** GitHub Actions, GitHub Pages.

## Arquitectura y Estructura del Proyecto

El proyecto está diseñado bajo el principio de **Separación de Responsabilidades (Separation of Concerns)**, aislando la lógica de negocio, la capa de red y la interfaz de usuario:

*   **`src/components/`**: Componentes visuales reutilizables y modulares (`Navbar`, `TaskForm`, `TaskTable`, `EditTaskModal`). Esto evita los "Fat Components" y mantiene las vistas principales limpias.
*   **`src/pages/`**: Vistas principales que orquestan los componentes y manejan las llamadas a la API (`LoginPage`, `DashboardPage`, `ProjectTasksPage`).
*   **`src/services/`**: Aislamiento de la capa de red. Toda la comunicación con la API (Axios) reside aquí, facilitando el mantenimiento y la escalabilidad.
*   **`src/hooks/`**: Custom hooks (`useAuth`, `useProjects`) para encapsular la lógica de estado.
*   **`src/context/`**: Manejo de estado global para la sesión del usuario (`AuthContext`).

## Autenticación y Rutas Protegidas

El sistema utiliza **JWT (JSON Web Tokens)** para manejar las sesiones:
1. Al iniciar sesión, el token devuelto se almacena en el `localStorage` para persistencia.
2. El `AuthContext` provee el estado de autenticación a toda la aplicación.
3. Las rutas privadas están envueltas en un componente `<ProtectedRoute/>` que redirige a `/login` si no hay una sesión activa.
4. Se configuró un **Interceptor de Axios** que inyecta automáticamente el encabezado `Authorization: Bearer <token>` en cada petición HTTP.

## API REST y CRUD Implementado

La aplicación consume el 100% de los métodos HTTP estándar para la gestión de tareas:
*   **POST:** Creación de nuevas tareas vinculadas a un ID de proyecto específico.
*   **GET:** Recuperación de la lista de proyectos y renderizado de tareas.
*   **PUT:** Edición total de una tarea existente (título, descripción, prioridad, fecha, responsable) a través de un Modal dedicado.
*   **PATCH:** Actualización parcial. Utilizado en el selector de la tabla para cambiar rápidamente el estado (`TODO`, `IN_PROGRESS`, `DONE`).
*   **DELETE:** Eliminación permanente de registros en la base de datos.

## Diseño UI/UX y Estado

*   **Tema Personalizado (Estética rosa):** Se implementó un `ThemeProvider` global para sobreescribir la paleta por defecto de MUI. Se utilizan tonos rosa pastel, bordes suavizados (radius 16) y tipografía *Times New Roman* para lograr una identidad visual elegante y distintiva.
*   **Feedback Visual y Perceived Performance:** Se implementaron estados de carga utilizando `<Skeleton/>` de MUI para las tarjetas y tablas, evitando pantallas en blanco o spinners estáticos mientras se resuelven las peticiones asíncronas.
*   **Navegación Dinámica:** El componente `<Navbar/>` detecta la ruta activa mediante `useLocation` para renderizar condicionalmente acciones contextuales (como el botón de retorno).

## Integración y Despliegue Continuo (CI/CD)

El proyecto cuenta con un flujo automatizado mediante **GitHub Actions** (`ci.yml`):
*   Al realizar un `push` a la rama `main`, el Action instala dependencias, compila el proyecto (`npm run build`) y genera los archivos estáticos.
*   El artefacto se despliega automáticamente en **GitHub Pages**.
*   **Configuración SPA:** En `vite.config.ts` se configuró la propiedad `base` para manejar las subrutas del repositorio, y se utiliza un script (`cp dist/index.html dist/404.html`) para que el enrutamiento de React Router funcione correctamente al recargar la página en producción.

---

### Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/proyecto-react.git](https://github.com/tu-usuario/proyecto-react.git)
2. Instalar dependencias
   npm insall
3. Ejecutar el servidor del desarrollo
   npm run dev
