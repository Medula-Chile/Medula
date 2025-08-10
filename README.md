# healthtechile-ficha-clinica
📊 Ficha clínica digital con agendamiento. Stack:   • Frontend: React/Vue + Vite   • Backend: Node.js (Express)   • DB: MongoDB (Mongoose)   • Auth: JWT   🚀 Desarrollado por @HealthTechILE. Próximos features: notificaciones y API externa. 

Estructura del proyecto; (Propuesto)

/
├── .github/                  # Configuraciones de GitHub (CI/CD, etc.)
│
├── backend/                  # API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/           # Configuración global
│   │   │   ├── db.js         # Conexión a MongoDB
│   │   │   └── auth.js       # Configuración de JWT
│   │   │
│   │   ├── controllers/      # Lógica de rutas
│   │   │   ├── authController.js  # Login/registro
│   │   │   ├── recordController.js # CRUD fichas
│   │   │   └── userController.js  # Gestión usuarios
│   │   │
│   │   ├── middlewares/      # Validaciones
│   │   │   ├── auth.js       # Autenticación JWT
│   │   │   └── roles.js      # Permisos (doctor/patient)
│   │   │
│   │   ├── models/           # Esquemas de MongoDB
│   │   │   ├── User.js       # Usuarios (roles)
│   │   │   ├── Record.js     # Fichas médicas
│   │   │   └── Doctor.js     # Datos específicos de doctores
│   │   │
│   │   ├── routes/           # Endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── recordRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── services/         # Lógica de negocio
│   │   │   ├── authService.js
│   │   │   └── recordService.js
│   │   │
│   │   ├── uploads/          # Archivos subidos (PDF, imágenes)
│   │   ├── utils/            # Helpers
│   │   └── app.js            # Inicialización del servidor
│   │
│   ├── tests/                # Pruebas
│   └── package.json
│
├── frontend/                 # Aplicación React
│   ├── public/               # Assets estáticos
│   │   ├── index.html
│   │   └── assets/           # Imágenes/fuentes
│   │
│   └── src/
│       ├── components/       # Componentes reutilizables
│       │   ├── Auth/
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   │
│       │   ├── UI/
│       │   │   ├── Button.jsx
│       │   │   └── Modal.jsx
│       │   │
│       │   └── ProtectedRoute.jsx  # Rutas con permisos
│       │
│       ├── contexts/         # Estados globales
│       │   ├── AuthContext.jsx
│       │   └── RecordContext.jsx
│       │
│       ├── hooks/            # Custom hooks
│       │   ├── useAuth.js
│       │   └── useRecords.js
│       │
│       ├── pages/            # Vistas
│       │   ├── Doctor/
│       │   │   ├── Dashboard.jsx    # Vista doctor
│       │   │   └── NewRecord.jsx    # Formulario diagnóstico
│       │   │
│       │   ├── Patient/
│       │   │   ├── Dashboard.jsx    # Vista paciente
│       │   │   └── RecordDetail.jsx # Ver historial
│       │   │
│       │   ├── Auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   │
│       │   └── Shared/
│       │       └── PdfViewer.jsx    # Visualizador de PDF
│       │
│       ├── services/         # Llamadas a la API
│       │   ├── api.js        # Configuración de Axios
│       │   ├── auth.js       # Login/registro
│       │   └── records.js    # Fetch de fichas
│       │
│       ├── styles/           # Estilos
│       │   ├── main.css      # Global
│       │   └── themes/       # Temas (opcional)
│       │
│       ├── App.jsx           # Componente raíz
│       ├── main.jsx          # Punto de entrada
│       └── routes.jsx        # Configuración de rutas (React Router)
│
├── docs/                    # Documentación
├── scripts/                 # Scripts de despliegue
└── README.md                # Guía del proyecto