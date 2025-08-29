<h1 align="center">🩺 Medula - Ficha Clínica Digital</h1>

<p align="center">
  <b>Ficha clínica digital con agendamiento</b>  
  <br/>
  <img src="https://img.shields.io/badge/Frontend-React%2018-blue?style=flat&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20(Express)-green?style=flat&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-success?style=flat&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=flat&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/badge/License-MIT-lightgrey"/>
  <br/>
  <i>Próximos features: Notificaciones y API externa</i>
</p>

---

## 📑 **Índice**

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Inicio Rápido](#guía-de-inicio-rápido)
  - [Requisitos Previos](#-requisitos-previos)
  - [Instalación](#-instalación)
  - [Configuración](#-configuración)
  - [Ejecución](#-ejecución)
- [Funcionalidades Principales](#funcionalidades-principales)
  - [Para Doctores](#-para-doctores)
  - [Para Pacientes](#-para-pacientes)
  - [Sistema de Autenticación](#-sistema-de-autenticación)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Frontend](#-frontend)
  - [Backend](#-backend)
  - [Desarrollo](#-desarrollo)
- [Próximas Funcionalidades](#próximas-funcionalidades)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📂 **Estructura del Proyecto**

<details>
<summary>Ver estructura de carpetas</summary>

medula-project/
├── client/                          # Aplicación React
│   ├── public/
│   │   ├── index.html               # Plantilla HTML principal
│   │   ├── favicon.ico              # Icono de la aplicación
│   │   └── manifest.json            # Configuración PWA
│   ├── src/
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── common/              # Componentes generales
│   │   │   │   ├── Header.js        # Encabezado de la aplicación
│   │   │   │   ├── Footer.js        # Pie de página
│   │   │   │   ├── Sidebar.js       # Menú lateral de navegación
│   │   │   │   ├── LoadingSpinner.js # Indicador de carga
│   │   │   │   └── Modal.js         # Componente modal
│   │   │   ├── auth/                # Componentes de autenticación
│   │   │   │   ├── Login.js         # Formulario de inicio de sesión
│   │   │   │   └── Register.js      # Formulario de registro
│   │   │   ├── dashboard/           # Panel principal
│   │   │   │   ├── Dashboard.js     # Panel principal
│   │   │   │   ├── StatsCard.js     # Tarjeta de estadísticas
│   │   │   │   ├── RecentActivity.js # Actividad reciente
│   │   │   │   └── UpcomingAppointments.js # Próximas citas
│   │   │   ├── medical/             # Componentes médicos
│   │   │   │   ├── MedicalRecords.js # Historial médico
│   │   │   │   ├── Appointments.js  # Citas médicas
│   │   │   │   ├── Prescriptions.js # Recetas médicas
│   │   │   │   ├── Exams.js         # Exámenes médicos
│   │   │   │   ├── AppointmentCard.js # Tarjeta de cita
│   │   │   │   └── LabResults.js    # Resultados de laboratorio
│   │   │   └── profile/             # Gestión de perfil
│   │   │       ├── UserProfile.js   # Perfil de usuario
│   │   │       └── ChangePassword.js # Cambio de contraseña
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── LoginPage.js         # Página de inicio de sesión
│   │   │   ├── RegisterPage.js      # Página de registro
│   │   │   ├── DashboardPage.js     # Página del dashboard
│   │   │   ├── MedicalHistoryPage.js # Página de historial médico
│   │   │   ├── AppointmentsPage.js  # Página de citas
│   │   │   ├── PrescriptionsPage.js # Página de prescripciones
│   │   │   └── ProfilePage.js       # Página de perfil
│   │   ├── services/                # Servicios API
│   │   │   ├── api.js               # Cliente HTTP para API
│   │   │   ├── auth.js              # Servicios de autenticación
│   │   │   ├── patients.js          # Servicios de pacientes
│   │   │   ├── records.js           # Servicios de registros
│   │   │   └── appointments.js      # Servicios de citas
│   │   ├── utils/                   # Utilidades
│   │   │   ├── formatters.js        # Funciones de formateo
│   │   │   ├── validators.js        # Validaciones de formularios
│   │   │   └── constants.js         # Constantes de la aplicación
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js           # Hook de autenticación
│   │   │   ├── useApi.js            # Hook para llamadas API
│   │   │   └── useForm.js           # Hook para formularios
│   │   ├── contexts/                # Contexts de React
│   │   │   ├── AuthContext.js       # Contexto de autenticación
│   │   │   └── AppContext.js        # Contexto de la aplicación
│   │   ├── styles/                  # Estilos
│   │   │   ├── Global.css           # Estilos globales
│   │   │   ├── Components.css       # Estilos de componentes
│   │   │   └── Theme.js             # Tema de la aplicación
│   │   ├── App.js                   # Componente principal
│   │   ├── index.js                 # Punto de entrada
│   │   └── App.css                  # Estilos principales
│   ├── package.json                 # Dependencias del frontend
│   └── vite.config.js               # Configuración de Vite
├── server/                          # Backend Node.js/Express
│   ├── controllers/                 # Lógica de endpoints
│   │   ├── authController.js        # Controlador de autenticación
│   │   ├── patientController.js     # Controlador de pacientes
│   │   ├── recordController.js      # Controlador de registros médicos
│   │   ├── appointmentController.js # Controlador de citas
│   │   └── userController.js        # Controlador de usuarios
│   ├── models/                      # Modelos de MongoDB
│   │   ├── User.js                  # Modelo de usuario
│   │   ├── Patient.js               # Modelo de paciente
│   │   ├── MedicalRecord.js         # Modelo de historial médico
│   │   └── Appointment.js           # Modelo de citas
│   ├── routes/                      # Definición de rutas
│   │   ├── auth.js                  # Rutas de autenticación
│   │   ├── patients.js              # Rutas de pacientes
│   │   ├── records.js               # Rutas de registros médicos
│   │   ├── appointments.js          # Rutas de citas
│   │   └── users.js                 # Rutas de usuarios
│   ├── middleware/                  # Middlewares
│   │   ├── auth.js                  # Middleware de autenticación
│   │   ├── validation.js            # Validación de datos
│   │   ├── errorHandler.js          # Manejo de errores
│   │   └── roleCheck.js             # Verificación de roles
│   ├── config/                      # Configuraciones
│   │   ├── database.js              # Configuración de MongoDB
│   │   ├── jwt.js                   # Configuración de JWT
│   │   └── server.js                # Configuración del servidor
│   ├── utils/                       # Utilidades del servidor
│   │   ├── helpers.js               # Funciones auxiliares
│   │   └── logger.js                # Sistema de logging
│   ├── server.js                    # Servidor principal
│   ├── package.json                 # Dependencias del backend
│   └── .env                         # Variables de entorno
├── docs/                            # Documentación
│   ├── API.md                       # Documentación de la API
│   ├── SETUP.md                     # Guía de instalación
│   └── ARCHITECTURE.md              # Arquitectura del sistema
└── scripts/                         # Scripts de despliegue y utilidades
    ├── deploy.sh                    # Script de despliegue
    ├── backup.sh                    # Script de respaldo
    └── setup.sh                     # Script de configuración


</details>

---

## 🚀 **Guía de Inicio Rápido**

<details>
<summary>Requisitos Previos</summary>

- Node.js (v16 o superior)  
- MongoDB (local o Atlas)  
- npm o yarn  

</details>

<details>
<summary>Instalación</summary>

```bash
# Clonar el repositorio
git clone https://github.com/usuario/medula-project.git
cd medula-project

# Instalar dependencias del backend
cd server
npm install

# Instalar dependencias del frontend
cd ../client
npm install

</details> <details> <summary>Configuración</summary>

Backend (server/.env)

PORT=5000
MONGODB_URI=mongodb://localhost:27017/medula
JWT_SECRET=tu_jwt_secreto_aqui
NODE_ENV=development

Frontend (client/.env)

VITE_API_BASE_URL=http://localhost:5000/api

</details> <details> <summary>Ejecución</summary>

# Iniciar backend
cd server
npm run dev

# Iniciar frontend (en otra terminal)
cd client
npm run dev

Abrir en navegador: http://localhost:5173
</details>
🩺 Funcionalidades Principales
<details> <summary>👩‍⚕️ Para Doctores</summary>

    Gestión de pacientes

    Creación y edición de fichas médicas

    Agendamiento de citas

    Visualización de historiales médicos

    Prescripción de medicamentos

</details> <details> <summary>🧑‍🤝‍🧑 Para Pacientes</summary>

    Visualización de historial médico

    Gestión de citas médicas

    Acceso a prescripciones y resultados

    Actualización de información personal

</details> <details> <summary>🔐 Sistema de Autenticación</summary>

    Registro e inicio de sesión seguros

    Roles de usuario (doctor/paciente)

    Tokens JWT para autorización

    Protección de rutas según roles

</details>
🛠 Tecnologías Utilizadas
<details> <summary>🎨 Frontend</summary>

    React 18

    React Router DOM

    Axios

    Context API

    CSS Modules

</details> <details> <summary>⚙️ Backend</summary>

    Node.js

    Express.js

    MongoDB (Mongoose)

    JWT

    bcrypt

</details> <details> <summary>🧰 Desarrollo</summary>

    Vite (Frontend)

    Nodemon (Backend)

    ESLint + Prettier

</details>
📅 Próximas Funcionalidades

    Sistema de notificaciones

    Integración con APIs externas de salud

    Historial de cambios en fichas médicas

    Dashboard administrativo

    Reportes y estadísticas

    App móvil con React Native

🤝 Contribución

# 1. Haz un fork del proyecto
# 2. Crea una nueva rama (git checkout -b feature/AmazingFeature)
# 3. Realiza tus cambios y haz commit (git commit -m 'Add AmazingFeature')
# 4. Haz push a la rama (git push origin feature/AmazingFeature)
# 5. Abre un Pull Request

📜 Licencia

Este proyecto está bajo la Licencia MIT.
Consulta el archivo LICENSE
para más detalles.