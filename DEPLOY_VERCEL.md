# 🚀 Guía de Despliegue en Vercel - Proyecto Medula

## 📋 Estructura del Proyecto

```
Medula/
├── api/                    # ✅ Funciones serverless para Vercel
│   └── index.js           # Punto de entrada que envuelve Express
├── client/                # Frontend React + Vite
│   ├── src/
│   │   └── api/          # ⚠️ NO confundir con /api (solo config axios)
│   └── dist/             # Build del frontend (generado)
├── server/               # Backend Express original
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
├── vercel.json           # ✅ Configuración de Vercel
└── .vercelignore         # Archivos a ignorar en deploy

```

## 🔧 Archivos Creados para Vercel

### 1. `/api/index.js`
- **Propósito**: Adapta tu servidor Express para funcionar como serverless function
- **Qué hace**: 
  - Importa todas las rutas de `/server`
  - Configura CORS para Vercel
  - Conecta a MongoDB
  - Exporta la app para Vercel

### 2. `/vercel.json`
- **Propósito**: Configuración de build y routing
- **Builds**:
  - Frontend: `client/` → static build
  - Backend: `api/index.js` → serverless function
- **Routes**:
  - `/api/*` → backend serverless
  - `/*` → frontend estático

### 3. `/client/package.json`
- **Agregado**: script `vercel-build`
- Ejecuta `vite build` durante el deploy

## 📝 Pasos para Desplegar

### 1. Instalar Vercel CLI (opcional)
```bash
npm install -g vercel
```

### 2. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel Dashboard → Settings → Environment Variables y agrega:

```env
# MongoDB
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/medula

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Frontend URL (se autodetecta en Vercel)
FRONTEND_URL=https://tu-proyecto.vercel.app

# Node
NODE_ENV=production
```

### 3. Deploy desde GitHub (Recomendado)

1. **Conecta tu repositorio a Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Import Project"
   - Conecta tu repo de GitHub

2. **Configuración automática**:
   - Vercel detectará `vercel.json`
   - Root Directory: `.` (raíz del proyecto)
   - Framework Preset: Other

3. **Deploy**:
   - Click en "Deploy"
   - Vercel hará el build automáticamente

### 4. Deploy desde CLI (Alternativa)

```bash
# Desde la raíz del proyecto
cd /home/neo/Dev/Medula

# Login a Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🔍 Verificar el Deploy

### Frontend
```
https://tu-proyecto.vercel.app
```

### Backend API
```
https://tu-proyecto.vercel.app/api/test
https://tu-proyecto.vercel.app/api/users
```

## ⚠️ Consideraciones Importantes

### 1. **Base de Datos**
- Asegúrate de usar MongoDB Atlas (no local)
- Whitelist la IP de Vercel: `0.0.0.0/0` (todas las IPs)

### 2. **Archivos Subidos (`/uploads`)**
- ⚠️ Vercel serverless es **stateless**
- Los archivos subidos se perderán en cada deploy
- **Solución**: Usar un servicio externo:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage

### 3. **Variables de Entorno**
- Nunca commitear `.env` al repositorio
- Configurar todas las variables en Vercel Dashboard

### 4. **CORS**
- El archivo `/api/index.js` ya incluye configuración CORS
- Acepta: `*.vercel.app` automáticamente

## 🐛 Troubleshooting

### Error: "404 - Not Found" en `/api/*`
**Solución**: Verifica que `vercel.json` esté en la raíz del proyecto

### Error: "Cannot connect to MongoDB"
**Solución**: 
1. Verifica `MONGO_URI` en variables de entorno de Vercel
2. Whitelist IP `0.0.0.0/0` en MongoDB Atlas

### Error: "Module not found"
**Solución**: 
1. Verifica que todas las dependencias estén en `server/package.json`
2. Ejecuta `npm install` en `/server`

### Frontend no carga
**Solución**:
1. Verifica que `client/dist` se genere correctamente
2. Ejecuta `npm run build` en `/client` localmente para probar

## 📦 Estructura de Archivos NO Modificados

- `/client/src/api/http.js` → **NO se mueve** (solo config de axios)
- `/server/*` → **NO se mueve** (se importa desde `/api/index.js`)
- Todas las rutas del frontend siguen funcionando igual

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] MongoDB Atlas configurado y accesible
- [ ] `vercel.json` en la raíz del proyecto
- [ ] `/api/index.js` creado
- [ ] `client/package.json` tiene script `vercel-build`
- [ ] `.vercelignore` configurado
- [ ] Git push al repositorio
- [ ] Conectar repo a Vercel

## 🎯 Resultado Final

Después del deploy tendrás:
- ✅ Frontend React en `https://tu-proyecto.vercel.app`
- ✅ Backend API en `https://tu-proyecto.vercel.app/api/*`
- ✅ Todo en un solo dominio (sin problemas de CORS)
- ✅ Deploy automático en cada push a GitHub

## 📚 Recursos

- [Vercel Docs - Node.js](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Vercel Docs - Monorepos](https://vercel.com/docs/monorepos)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
