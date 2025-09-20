# Estructura de componentes del Portal del Paciente

Este directorio agrupa los componentes React del Portal del Paciente. La estructura está pensada para separar el **layout** general de cada **vista funcional** y de los **componentes reutilizables**.

## Estructura propuesta

```
client/src/components/paciente/
├─ layout/                 # Shell específico de la app de Paciente
│  ├─ (PacienteLayout.jsx, PacientePage.jsx)
│
├─ historial/              # Vista Mi Historial (timeline + detalle)
│  ├─ (Timeline.jsx, ConsultationDetail.jsx)
│
├─ medicamentos/           # Vista Mis Medicamentos (pendiente)
│
├─ examenes/               # Vista Mis Exámenes (en trabajo por compañero)
│
├─ centro/                 # Vista Centro Médico (en trabajo por compañero)
│
├─ perfil/                 # Vista Mi Perfil (pendiente)
│
├─ configuracion/          # Vista Configuración (pendiente)
│
├─ shared/                 # Componentes reutilizables (cards, helpers)
│  ├─ (VitalsCard.jsx, ActiveMedicationsCard.jsx, QuickActionsCard.jsx, NextAppointmentCard.jsx)
│
└─ README.md
```

Además, los componentes comunes para todas las vistas (como `Header` y `Aside`) están centralizados en:

```
client/src/components/header/
├─ Header.jsx
└─ Aside.jsx
```

Notas:
- Los nombres entre paréntesis indican los componentes actuales que se moverán cuando se haga la migración de archivos.
- Se incluyen `.gitkeep` para que las carpetas vacías se mantengan versionadas.

## Convenciones
- Un componente por archivo, con PascalCase (`MiComponente.jsx`).
- Evitar rutas relativas frágiles: usaremos *barrels* (`index.js`) por carpeta para exportaciones limpias.
- CSS: se hereda el `plantilla.css` por ahora; estilos específicos de cada vista pueden vivir junto a sus componentes (`MiComponente.module.css`) cuando sea necesario.

## Plan de migración (siguiente paso)
1. Mover componentes actuales a su carpeta destino:
   - `PacienteLayout.jsx`, `PacientePage.jsx` → `layout/`
   - `Header.jsx`, `Aside.jsx` → `components/header/`
   - `Timeline.jsx`, `ConsultationDetail.jsx` → `historial/`
   - `VitalsCard.jsx`, `ActiveMedicationsCard.jsx`, `QuickActionsCard.jsx`, `NextAppointmentCard.jsx` → `shared/`
2. Actualizar los imports en `PacienteLayout.jsx` y demás archivos.
3. Crear `index.js` en cada carpeta para exportar componentes (barrels).
4. (Cuando estén listas) añadir componentes de `medicamentos/`, `examenes/`, `centro/`, `perfil/`, `configuracion/`.

## Barrels (ejemplo futuro)
`historial/index.js`:
```js
export { default as Timeline } from './Timeline';
export { default as ConsultationDetail } from './ConsultationDetail';
```

`layout/index.js`:
```js
export { default as PacienteLayout } from './PacienteLayout';
export { default as PacientePage } from './PacientePage';
```

`shared/index.js`:
```js
export { default as VitalsCard } from './VitalsCard';
export { default as ActiveMedicationsCard } from './ActiveMedicationsCard';
export { default as QuickActionsCard } from './QuickActionsCard';
export { default as NextAppointmentCard } from './NextAppointmentCard';
```

`components/header/index.js`:
```js
export { default as Header } from './Header';
export { default as Aside } from './Aside';
```

## Notas sobre rutas HTML → JSX
- El contenido de `03-Historial.html` ya está cubierto por los componentes `historial/` y `shared/`.
- Cuando se migren las otras vistas, mantener los textos/datos mockeados para validar equivalencia semántica con los HTML originales.

