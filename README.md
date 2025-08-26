# -Medula -ficha-clinica

> 📊 Ficha clínica digital con agendamiento  
> **Stack:** Frontend: React/Vue + Vite • Backend: Node.js (Express) • DB: MongoDB (Mongoose) • Auth: JWT  
> 🚀 Desarrollado por @Medula 
> **Próximos features:** notificaciones y API externa.

---

<details>
<summary><strong>1. Estructura del proyecto</strong></summary>

A continuación se describe la organización del repositorio y el propósito de cada carpeta principal:

- **.github/**: Contiene la configuración específica para GitHub, como flujos de trabajo de CI/CD y automatizaciones para pruebas y despliegues.
- **backend/**: Incluye todo el código fuente del backend, implementado en Node.js con Express. Aquí se encuentran la lógica de negocio, modelos de datos, rutas de la API y la configuración de la base de datos y autenticación.
- **frontend/**: Contiene la aplicación de frontend desarrollada en React (o Vue), junto con sus componentes, páginas, hooks personalizados y servicios para interactuar con el backend.
- **docs/**: Carpeta destinada a documentación adicional del proyecto, como manuales técnicos, diagramas o especificaciones.
- **README.md**: Este archivo, que sirve como guía de inicio y referencia rápida sobre el proyecto.

```text
/
├── .github/                  # Configuración de GitHub
│   └── workflows/            # Automatización (tests y despliegues)
│   # Incluye archivos YAML para definir acciones automáticas como integración continua y despliegue.
│
├── backend/                  # API del sistema (Node.js/Express)
│   # Código fuente del backend, lógica de negocio, modelos, rutas y configuración.
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # Conexión a MongoDB
│   │   │   └── auth.js       # Configuración JWT
│   │   │
│   │   ├── controllers/      # Lógica de negocio
│   │   │   ├── auth.js       # Autenticación (login/registro)
│   │   │   ├── patients.js   # Gestión pacientes (añadir/listar)
│   │   │   └── records.js    # CRUD fichas médicas
│   │   │
│   │   ├── models/           # Modelos de datos
│   │   │   ├── User.js       # Usuarios (doctores/pacientes)
│   │   │   └── Record.js     # Fichas clínicas
│   │   │
│   │   ├── routes/           # Endpoints API
│   │   │   ├── auth.js       # /login, /register
│   │   │   └── api.js        # Rutas protegidas (/patients, /records)
│   │   │
│   │   └── app.js            # Configuración servidor Express
│   │
│   └── package.json          # Dependencias backend
│
├── frontend/                 # Aplicación React
│   # Código fuente del frontend, componentes, páginas, hooks y servicios.
│   ├── public/               # Archivos estáticos
│   │   ├── index.html        # Plantilla HTML base
│   │   └── assets/           # Imágenes/iconos
│   │
│   └── src/
│       ├── components/       # Componentes reutilizables
│       │   ├── Auth/
│       │   │   ├── LoginForm.jsx  # Formulario controlado
│       │   │   └── RegisterForm.jsx
│       │   │
│       │   └── UI/
│       │       ├── Button.jsx     # Componente estilizado
│       │       └── Modal.jsx      # Diálogos emergentes
│       │
│       ├── hooks/            # Lógica reusable
│       │   ├── useAuth.js     # Manejo de autenticación
│       │   └── useApi.js      # Fetch a la API
│       │
│       ├── pages/            # Vistas completas
│       │   ├── Doctor/
│       │   │   ├── Dashboard.jsx  # Tablero médico
│       │   │   └── AddPatient.jsx # Formulario nuevo paciente  <-- Añadido
│       │   │
│       │   └── Patient/
│       │       └── Dashboard.jsx  # Vista paciente
│       │
│       ├── services/         # Conexión al backend
│       │   └── api.js        # Configuración Axios
│       │
│       ├── App.jsx           # Configuración rutas
│       └── main.jsx          # Renderizado inicial
│
├── docs/                     # Documentación
│   # Manuales, diagramas, especificaciones y otros recursos documentales.
└── README.md                 # Guía de inicio
```
</details>

---

<details>
<summary><strong>2. Descripción de archivos clave por carpeta</strong></summary>

#### backend/src/config/
- **db.js**: Configura y establece la conexión con la base de datos MongoDB.
- **auth.js**: Define la configuración y utilidades para la autenticación basada en JWT.

#### backend/src/controllers/
- **auth.js**: Controlador para el registro e inicio de sesión de usuarios (doctores y pacientes).
- **patients.js**: Lógica para crear, listar y actualizar pacientes. Usado por personal clínico.
- **records.js**: Permite crear, leer, actualizar y eliminar fichas clínicas. El personal clínico ingresa y edita datos; los pacientes pueden consultar sus registros.

#### backend/src/models/
- **User.js**: Modelo de usuario, diferenciando roles (doctor, paciente) y sus atributos.
- **Record.js**: Modelo de ficha clínica, almacena información médica relevante asociada a cada paciente.

#### backend/src/routes/
- **auth.js**: Define rutas públicas para login y registro.
- **api.js**: Rutas protegidas para operaciones sobre pacientes y fichas clínicas, accesibles según el rol del usuario.

#### backend/src/app.js
- Configura y arranca el servidor Express, aplica middlewares y rutas.

#### frontend/public/
- **index.html**: Plantilla HTML base para la SPA.
- **assets/**: Imágenes, íconos y recursos estáticos.

#### frontend/src/components/Auth/
- **LoginForm.jsx**: Formulario de autenticación para doctores y pacientes.
- **RegisterForm.jsx**: Formulario de registro de nuevos usuarios.

#### frontend/src/components/UI/
- **Button.jsx**: Botón reutilizable y estilizado.
- **Modal.jsx**: Componente para mostrar diálogos emergentes (ej: confirmaciones, formularios).

#### frontend/src/hooks/
- **useAuth.js**: Hook personalizado para gestionar el estado de autenticación y roles.
- **useApi.js**: Hook para realizar peticiones HTTP al backend de forma centralizada.

#### frontend/src/pages/Doctor/
- **Dashboard.jsx**: Vista principal del doctor; muestra pacientes, fichas y accesos rápidos.
- **AddPatient.jsx**: Formulario para que el personal clínico registre nuevos pacientes.

#### frontend/src/pages/Patient/
- **Dashboard.jsx**: Vista principal del paciente; permite consultar sus fichas clínicas y datos personales.

#### frontend/src/services/
- **api.js**: Configuración de Axios para consumir la API, incluyendo manejo de tokens.

#### frontend/src/App.jsx
- Define las rutas principales de la aplicación según el rol (doctor/paciente).

#### frontend/src/main.jsx
- Punto de entrada de la aplicación React, renderiza el componente raíz.

#### docs/
- Manuales técnicos, diagramas de flujo, documentación de endpoints y guías de uso para personal clínico y pacientes.

#### README.md
- Guía de inicio, estructura y referencias rápidas del proyecto.

</details>

---

<details>
<summary><strong>3. Notas de uso</strong></summary>

- El personal clínico (doctor) puede ingresar y editar datos de pacientes y fichas clínicas.
- Los pacientes pueden autenticarse y consultar sus propios registros médicos y datos personales.

</details>

---

<details>
<summary><strong>4. Glosario de términos</strong></summary>

- **API (Application Programming Interface)**: Conjunto de rutas y métodos que permiten la comunicación entre el frontend y el backend. En este proyecto, la API expone endpoints para autenticación, gestión de pacientes y fichas clínicas.
- **UI (User Interface)**: Interfaz de usuario. Hace referencia a los componentes visuales y de interacción que permiten a doctores y pacientes usar la aplicación de manera intuitiva.
- **JWT (JSON Web Token)**: Estándar para el intercambio seguro de información mediante tokens firmados digitalmente. Se utiliza para autenticar y autorizar usuarios en la aplicación.
- **SPA (Single Page Application)**: Aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido conforme el usuario interactúa, sin recargar la página completa.
- **Hook**: En React, funciones reutilizables que permiten gestionar estado y lógica de componentes de forma sencilla y modular.
- **Endpoint**: URL específica de la API a la que se puede hacer una petición para realizar una acción (ejemplo: `/api/patients` para obtener pacientes).
- **Token**: Cadena generada tras autenticación, utilizada para identificar y autorizar a un usuario en cada petición protegida.

</details>

---

bizagi modeler plataforma de automatizacion de procesos
