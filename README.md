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
├── client/ # Aplicación React
│ ├── public/
│ ├── src/
│ │ ├── components/ # Componentes reutilizables
│ │ │ ├── common/ # Header, Footer, Sidebar, etc.
│ │ │ ├── auth/ # Login, Registro
│ │ │ ├── dashboard/ # Panel principal
│ │ │ ├── medical/ # Componentes médicos
│ │ │ └── profile/ # Perfil de usuario
│ │ ├── pages/ # Páginas principales
│ │ ├── services/ # Servicios API
│ │ ├── utils/ # Utilidades
│ │ ├── hooks/ # Custom hooks
│ │ ├── contexts/ # Context API
│ │ └── styles/ # Estilos globales y temas
├── server/ # Backend Node.js/Express
│ ├── controllers/ # Lógica de endpoints
│ ├── models/ # Modelos MongoDB
│ ├── routes/ # Definición de rutas
│ ├── middleware/ # Middlewares
│ ├── config/ # Configuración de servidor y DB
│ └── utils/ # Utilidades
├── docs/ # Documentación
└── scripts/ # Scripts de despliegue


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