# healthtechile-ficha-clinica
📊 Ficha clínica digital con agendamiento. Stack:   • Frontend: React/Vue + Vite   • Backend: Node.js (Express)   • DB: MongoDB (Mongoose)   • Auth: JWT   🚀 Desarrollado por @HealthTechILE. Próximos features: notificaciones y API externa. 

Estructura del proyecto; (Propuesto)

/
├── .github/                  # Configuración de GitHub
│   └── workflows/            # Automatización (tests y despliegues)
│
├── backend/                  # API del sistema (Node.js/Express)
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
└── README.md                 # Guía de inicio

bizagi modeler plataforma de automatizacion de procesos
