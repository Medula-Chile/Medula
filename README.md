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
  <br/>
  <i>Próximos features: Notificaciones y API externa</i>
</p>

---

## 🧭 Índice

- [Descripción](#-descripción)
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
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Changelog](#-changelog)
- [Licencia y Contacto](#-licencia-y-contacto)

---

## 📝 Descripción

**Medula** es una plataforma web moderna para digitalizar la gestión clínica y administrativa de centros de salud. Conecta **pacientes**, **médicos** y **administradores** en flujos seguros y eficientes: **agenda**, **historial clínico**, **exámenes**, **prescripciones** y **dashboard**.

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

> Resumen de colecciones principales (nombres pueden variar levemente según el repo).

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
// HistorialMedico
db.Historial.createIndex({ paciente_id: 1, fecha: -1 });
db.Historial.createIndex({ profesional_id: 1 });
db.Historial.createIndex({ fecha: -1 });

// Examenes
db.Examenes.createIndex({ paciente_id: 1, fecha_resultado: -1 });
db.Examenes.createIndex({ historial_id: 1 });

// Appointment
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
# Clonar
git clone https://github.com/Medula-Chile/Medula.git
cd Medula

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
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
npm run dev    # nodemon

# Frontend (otra terminal)
cd client
npm run dev    # http://localhost:5173
```

---

## 🩺 Funcionalidades

### 👨‍⚕️ Doctores
- Gestión de pacientes y fichas.
- **Historial clínico** (diagnóstico, tratamiento, notas, medicamentos).
- **Exámenes** asociados a consultas/pacientes (PDF/imagen opcional).
- Agenda y manejo de **citas**.

### 🧑‍🤝‍🧑 Pacientes
- Acceso a su historial clínico.
- Gestión de **citas**.
- Prescripciones y resultados.
- Actualización de datos personales.

### 🔐 Autenticación
- Login/Registro con **JWT**.
- Roles: **Admin**, **Médico**, **Paciente**.
- Protección de rutas por rol.

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
  {
    "_id": "671...e9",
    "medicoNombre": "Dra. Paula Contreras",
    "fecha_hora": "2024-08-15T10:30:00.000Z",
    "resumen": "Control anual; diagnóstico: anemia ferropénica",
    "observaciones": "Suplemento de hierro por 3 meses",
    "estado": "completada",
    "examenes": [
      {
        "_id": "672...d4",
        "tipo": "Hemograma",
        "fecha_resultado": "2024-08-14T12:00:00.000Z",
        "laboratorio": "LabCentral",
        "resultado": "Hb baja (10.8 g/dL)",
        "archivoUrl": "https://.../hemograma-672d4.pdf",
        "historial_id": "671...e9"
      }
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
  ],
  "notas": "Hidratación y reposo"
}
```

---

## 🐳 Docker (opcional)

Archivo mínimo `docker-compose.yml`:

```yaml
version: '3.9'
services:
  api:
    build: ./server
    container_name: medula_api
    environment:
      - PORT=5000
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - mongo

  web:
    build: ./client
    container_name: medula_web
    environment:
      - VITE_API_URL=http://localhost:5000/api
    ports:
      - "5173:5173"
    depends_on:
      - api

  mongo:
    image: mongo:6
    container_name: medula_db
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 🌱 Seeds y Datos de Prueba

Script sugerido: `server/scripts/seed.js` para crear:

- Usuarios (admin, médico, paciente)
- Médico + Paciente
- Citas de ejemplo
- 1–2 historiales con **exámenes**

```bash
cd server
npm run seed   # si está definido en package.json
```

---

## ✅ Testing

- **Unit**: lógica de controladores y utils.
- **Integration**: endpoints críticos (`/auth`, `/historial`).
- **E2E (opcional)**: Cypress (login → agenda → historial → exámenes).

Sugerencia de scripts (`server/package.json`):
```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:e2e": "cypress run"
  }
}
```

---

## ☁️ Despliegue

- **Frontend**: Vercel / Netlify (build Vite).
- **Backend**: Render / Railway / Fly.io.
- **DB**: MongoDB Atlas.
- **Assets**: Cloudinary para PDFs/imagenes de exámenes.
- **ENV**: en producción, setea `VITE_API_URL` al dominio del backend.

---

## 🚀 Performance

- Índices en colecciones grandes (ver [Modelo de Datos](#-modelo-de-datos)).
- Paginación (`limit`, `skip`) en listados voluminosos.
- Filtros **server-side** (en `/historial`) cuando cambien `q/from/to`.
- `populate` selectivo (proyectar campos necesarios).
- Cache (opcional) para consultas pesadas/recurrentes.

---

## 🔐 Seguridad

- JWT firmado (rotar `JWT_SECRET`).
- CORS por entorno.
- Sanitización / validación de payloads.
- Control de acceso por rol/middleware.
- Validación de archivos (si subes PDFs de exámenes).

---

## 🌍 i18n & Accesibilidad

- Fechas/región **es-CL**.
- Formularios con labels y `aria-*`.
- Contraste adecuado y estados `:focus` visibles.
- Textos alternativos en imágenes.

---

## 🆘 Troubleshooting

- **`MongoNetworkError`**: revisa `MONGO_URI` y allowlist de IP en Atlas.
- **CORS**: ajusta origen en middleware del backend.
- **404 en API**: confirma `VITE_API_URL` y prefijo `/api`.
- **JWT inválido**: envía `Authorization: Bearer <token>`.

---

## 🗺️ Roadmap

- [ ] Notificaciones (email/SMS) para recordatorios de citas
- [ ] Integraciones con APIs externas de salud
- [ ] Firma digital de recetas
- [ ] Auditoría de cambios en historial
- [ ] Multisede / multi-centro
- [ ] App móvil (React Native)
- [ ] PWA / Modo offline

---

## 🤝 Contribución

1. Haz un **fork**.
2. Crea tu rama: `git checkout -b feat/mi-feature`.
3. Commit: `git commit -m "feat: agrega mi feature"`.
4. Push: `git push origin feat/mi-feature`.
5. Abre un **Pull Request**.

> Estilo recomendado: [Conventional Commits](https://www.conventionalcommits.org/).

---

## 🧭 Changelog

- **1.0.0** — Base del proyecto: auth, pacientes/médicos, citas, historial con exámenes, dashboard inicial.

---

## 📜 Licencia y Contacto

- Licencia: **MIT** (ver `LICENSE`).
- Repo: **https://github.com/Medula-Chile/Medula**
- Issues: usa el tab **Issues** en el repositorio
- Equipo: Medula Chile
