<!-- HEADER -->
<h1 align="center">🩺 Medula — Ficha Clínica Digital</h1>

<p align="center">
  <b>Ficha clínica digital con agendamiento, historial, exámenes y panel administrativo</b>
  <br/><br/>
  <a href="https://github.com/Medula-Chile/Medula">
    <img src="https://img.shields.io/badge/Repo-Medula--Chile/Medula-000?logo=github&style=for-the-badge" alt="Repo"/>
  </a>
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=000&style=for-the-badge" alt="React 18"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20(Express)-339933?logo=node.js&logoColor=fff&style=for-the-badge" alt="Node.js Express"/>
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=fff&style=for-the-badge" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens&style=for-the-badge" alt="JWT"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT"/>
</p>

---

## 🧭 Índice

- [Descripción](#-descripción)
- [Vista previa](#-vista-previa)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Inicio Rápido](#-inicio-rápido)
  - [Requisitos](#-requisitos)
  - [Instalación](#-instalación)
  - [Variables de Entorno](#-variables-de-entorno)
  - [Ejecución](#-ejecución)
- [Funcionalidades](#-funcionalidades)
- [Permisos y Roles](#-permisos-y-roles)
- [API (vista rápida + ejemplos)](#-api-vista-rápida--ejemplos)
- [Docker (opcional)](#-docker-opcional)
- [Seeds y Datos de Prueba](#-seeds-y-datos-de-prueba)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Performance](#-performance)
- [Seguridad](#-seguridad)
- [i18n & Accesibilidad](#-i18n--accesibilidad)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)
- [Changelog](#-changelog)
- [Licencia y Contacto](#-licencia-y-contacto)

---

## 📝 Descripción

**Medula** es una plataforma web moderna para digitalizar la gestión clínica y administrativa de centros de salud. Conecta **pacientes**, **médicos** y **administradores** en flujos seguros y eficientes: **agenda**, **historial clínico**, **exámenes**, **prescripciones** y **dashboard**.

---

## 🖼️ Vista previa

<div align="center">

<table>
  <tr>
    <td align="center">
      <img src="docs/images/01-portal-medico-atencion.png" alt="Portal Médico — Atención del paciente" width="480" />
      <br/><sub>Portal Médico — Atención del paciente</sub>
    </td>
    <td align="center">
      <img src="docs/images/02-portal-medico-agenda.png" alt="Agenda del Médico" width="480" />
      <br/><sub>Agenda del Médico</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/images/03-portal-medico-configuracion.png" alt="Configuración del Médico" width="480" />
      <br/><sub>Configuración del Médico</sub>
    </td>
    <td align="center">
      <img src="docs/images/04-admin-dashboard.png" alt="Dashboard Administrador" width="480" />
      <br/><sub>Dashboard Administrador</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/images/05-portal-paciente-historial.png" alt="Portal Paciente — Historial" width="480" />
      <br/><sub>Portal Paciente — Historial</sub>
    </td>
    <td align="center">
      <img src="docs/images/06-admin-usuarios.png" alt="Administración de Usuarios" width="480" />
      <br/><sub>Administración de Usuarios</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/images/07-admin-citas.png" alt="Gestión de Citas Médicas" width="480" />
      <br/><sub>Gestión de Citas Médicas</sub>
    </td>
    <td align="center">
      <img src="docs/images/08-admin-centros.png" alt="Gestión de Centros de Salud" width="480" />
      <br/><sub>Gestión de Centros de Salud</sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="docs/images/09-portal-paciente-recetas.png" alt="Portal Paciente — Recetas" width="820" />
      <br/><sub>Portal Paciente — Recetas</sub>
    </td>
  </tr>
</table>

</div>

---

## 🏗️ Arquitectura

```txt
React (Vite) ── Axios ───────────┐
                                 │  HTTP/JSON (REST)
                                 ▼
                          Express API (Node)
                               │
                     Mongoose ODM (MongoDB Atlas)
                               │
                     Colecciones + Índices + Seeds
```

- SPA con **React 18 + Vite**.
- API REST con **Express** + **JWT** + middlewares.
- **MongoDB Atlas** con **Mongoose**.
- Búsquedas y filtros (texto / rango de fechas) con **índices**.

---

## 🗃️ Modelo de Datos

| Colección         | Campos clave                                                                          |
|-------------------|----------------------------------------------------------------------------------------|
| `User`            | `nombre`, `email`, `rut`, `rol (admin/medico/paciente)`, `hash`                        |
| `Paciente`        | `usuario_id`, `contacto`, `alergias`, `antecedentes`                                   |
| `Medico`/`Doctor` | `usuario_id`, `especialidad`, `centro_id`, `titulo_profesional`, `años_experiencia`   |
| `Appointment`     | `paciente_id`, `profesional_id`, `fecha_hora`, `estado`, `motivo`                      |
| `HistorialMedico` | `paciente_id`, `profesional_id`, `fecha`, `diagnostico`, `tratamiento`, `medicamentos`, `notas` |
| `Examen`          | `paciente_id`, `historial_id?`, `tipo`, `laboratorio`, `fecha_resultado`, `resultado`, `archivoUrl` |

**Índices recomendados**
```js
db.Historial.createIndex({ paciente_id: 1, fecha: -1 });
db.Historial.createIndex({ profesional_id: 1 });
db.Historial.createIndex({ fecha: -1 });
db.Examenes.createIndex({ paciente_id: 1, fecha_resultado: -1 });
db.Examenes.createIndex({ historial_id: 1 });
db.Appointments.createIndex({ profesional_id: 1, fecha_hora: -1 });
```

---

## 📂 Estructura del Proyecto

```txt
client/                     # React (Vite)
  public/
  src/
    components/             # auth, common, medical, ui
    pages/                  # admin, doctor, patient, auth
    services/               # axios (api.js, auth.js, patients.js, doctors.js)
    contexts/               # AuthContext, AppContext
    hooks/                  # useAuth, useApi...
    utils/                  # constants, helpers...
    styles/
    App.jsx, main.jsx, App.css
  package.json, vite.config.js, index.html

server/                     # Node/Express
  controllers/              # auth, user, patient, doctor, appointment, specialty, historial
  models/                   # User, Paciente, Medico, Appointment, Specialty, HistorialMedico, Examen
  routes/                   # auth, users, patients, doctors, appointments, specialties, historial
  middleware/               # auth, validation, errorHandler
  config/                   # database, cloudinary
  utils/                    # generateToken, uploadHandler
  server.js
```

---

## ⚡ Inicio Rápido

### ✅ Requisitos
- Node.js **18+**
- MongoDB (local o Atlas)
- npm o yarn

### 📦 Instalación

```bash
git clone https://github.com/Medula-Chile/Medula.git
cd Medula
cd server && npm install
cd ../client && npm install
```

### 🔧 Variables de Entorno

**Server → `server/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI="your-mongodb-atlas-uri"
JWT_SECRET="your-super-secret"
CLOUDINARY_URL=""    # opcional
```

**Client → `client/.env`**
```env
VITE_API_URL="http://localhost:5000/api"
```

### ▶️ Ejecución

```bash
# Backend
cd server
npm run dev

# Frontend (otra terminal)
cd client
npm run dev    # http://localhost:5173
```

---

## 🩺 Funcionalidades

### 👨‍⚕️ Doctores
- Gestión de pacientes y fichas.
- **Historial clínico** (diagnóstico, tratamiento, notas, medicamentos).
- **Exámenes** (PDF/imagen).
- Agenda y **citas**.

### 🧑‍🤝‍🧑 Pacientes
- Historial clínico propio.
- Gestión de **citas**.
- Prescripciones y resultados.
- Datos personales.

### 🔐 Autenticación
- **JWT** + roles (**Admin**, **Médico**, **Paciente**).
- Protección de rutas.

---

## 🔒 Permisos y Roles

| Recurso/Acción           | Admin | Médico | Paciente |
|--------------------------|:-----:|:------:|:--------:|
| Ver usuarios             |  ✅   |   ❌   |    ❌    |
| Crear/editar médicos     |  ✅   |   ❌   |    ❌    |
| Ver/editar su historial  |  ❌   |   ✅   |    ✅*   |
| Ver citas del paciente   |  ✅   |   ✅   |    ✅    |
| Crear/editar citas       |  ✅   |   ✅   |    ✅    |
| Ver exámenes             |  ✅   |   ✅   |    ✅    |

> \* El paciente ve **solo su** historial.

---

## 🔌 API (vista rápida + ejemplos)

**Base:** `${VITE_API_URL}` (p. ej. `http://localhost:5000/api`)

| Método | Endpoint         | Descripción                              | Auth |
|-------:|------------------|------------------------------------------|:----:|
| POST   | `/auth/login`    | Iniciar sesión (JWT)                     |  —   |
| GET    | `/users`         | Listado de usuarios (admin)              | ✅   |
| GET    | `/patients`      | Listado de pacientes                     | ✅   |
| GET    | `/doctors`       | Listado de médicos                       | ✅   |
| GET    | `/appointments`  | Citas (query por doctor/paciente/fecha)  | ✅   |
| GET    | `/historial`     | Historial clínico (con **exámenes**)     | ✅   |
| GET    | `/historial/:id` | Item de historial (con **exámenes**)     | ✅   |
| POST   | `/historial`     | Crear item de historial                  | ✅   |

**Ejemplo — GET /historial**
```http
GET /api/historial?paciente=66f...a1&doctor=66e...b2&from=2024-01-01&to=2024-12-31&q=hemograma
Authorization: Bearer <token>
```

```json
[
  { "medicoNombre": "Dra. Paula Contreras",
    "fecha_hora": "2024-08-15T10:30:00.000Z",
    "resumen": "Control anual; diagnóstico: anemia ferropénica",
    "estado": "completada",
    "examenes": [
      { "tipo": "Hemograma", "resultado": "Hb baja (10.8 g/dL)" }
    ]
  }
]
```

**Ejemplo — POST /historial**
```http
POST /api/historial
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "paciente_id": "66f...a1",
  "profesional_id": "66d...c2",
  "diagnostico": "Faringitis aguda",
  "tratamiento": "Amoxicilina 500mg c/8h por 7 días",
  "medicamentos": [
    { "nombre": "Amoxicilina", "dosis": "500mg", "frecuencia": "c/8h", "duracion": "7d" }
  ]
}
```

---

## 🐳 Docker (opcional)

```yaml
version: '3.9'
services:
  api:
    build: ./server
    environment:
      - PORT=5000
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    ports: ["5000:5000"]
    depends_on: [mongo]

  web:
    build: ./client
    environment:
      - VITE_API_URL=http://localhost:5000/api
    ports: ["5173:5173"]
    depends_on: [api]

  mongo:
    image: mongo:6
    volumes: [mongo_data:/data/db]

volumes:
  mongo_data:
```

---

## 🌱 Seeds y Datos de Prueba

`server/scripts/seed.js` (sugerido) para crear usuarios, médico/paciente, citas e historiales con **exámenes**.

```bash
cd server
npm run seed   # si está definido
```

---

## ✅ Testing

- **Unit**: controladores y utils.
- **Integration**: `/auth`, `/historial`.
- **E2E (opcional)**: Cypress (login → agenda → historial → exámenes).

---

## ☁️ Despliegue

- **Frontend**: Vercel / Netlify (Vite).
- **Backend**: Render / Railway / Fly.io.
- **DB**: MongoDB Atlas.
- **Assets**: Cloudinary.
- **ENV**: setear `VITE_API_URL` al dominio de backend.

---

## 🚀 Performance

- Índices (ver Modelo).
- Paginación (`limit`, `skip`).
- Filtros server-side (`/historial`).
- `populate` selectivo.

---

## 🔐 Seguridad

- JWT firmado (rotar `JWT_SECRET`).
- CORS por entorno.
- Validación/sanitización de payloads.
- Control de acceso por rol.

---

## 🌍 i18n & Accesibilidad

- es-CL (fechas).
- Labels y `aria-*`.
- Contraste y `:focus` visibles.

---

## 🤝 Contribución

1. Fork.
2. Rama: `feat/mi-feature`.
3. Commit: `feat: agrega mi feature`.
4. PR.

---

## 🧭 Changelog

- **1.0.0** — Base: auth, pacientes/médicos, citas, historial con exámenes, dashboard inicial.

---

## 📜 Licencia y Contacto

- Licencia: **MIT** (ver `LICENSE`).
- Repo: **https://github.com/Medula-Chile/Medula**
- Email: **medulaservicio@gmail.com**
- Issues: usar el tab **Issues** del repositorio
