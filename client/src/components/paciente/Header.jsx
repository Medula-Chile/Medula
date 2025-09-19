 import React from 'react';

 export default function Header({ onToggleSidebar, onLogout }) {
   return (
     <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
       <div className="d-flex align-items-center justify-content-between">
         <div className="d-flex align-items-center">
           <button
             className="btn btn-ghost d-lg-none me-2"
             type="button"
             onClick={onToggleSidebar}
             aria-label="Abrir menú lateral"
           >
             <i className="fas fa-bars"></i>
           </button>

           <div className="d-flex align-items-center gap-3">
             <div className="bg-primary rounded-lg p-2">
               <i className="fas fa-stethoscope text-white"></i>
             </div>
             <div>
               <h1 className="h5 mb-0 fw-bold text-primary">MEDULA</h1>
               <p className="text-muted-foreground small mb-0">Portal del Paciente</p>
             </div>
           </div>
         </div>

         <div className="d-none d-md-flex flex-grow-1 justify-content-center text-center">
           <div>
             <h2 className="h6 fw-semibold mb-0">Hola, María</h2>
             <p className="text-muted-foreground small mb-0">Bienvenida a tu portal médico</p>
           </div>
         </div>

         <div className="d-flex align-items-center gap-3">
           <div className="d-none d-md-flex align-items-center gap-2">
             <i className="fas fa-shield-alt text-success"></i>
             <span className="custom-badge border-success text-success">Conexión Segura</span>
           </div>

           <button className="btn btn-ghost position-relative" aria-label="Notificaciones">
             <i className="fas fa-bell"></i>
             <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-destructive">
               2
             </span>
           </button>

           {/*<button className="btn btn-ghost d-none d-md-flex align-items-center gap-2" onClick={onLogout}>
             <i className="fas fa-sign-out-alt"></i>
             <span>Cerrar Sesión</span>
           </button>*/}

           <div className="d-flex align-items-center gap-3 ps-3 border-start border-gray-200">
             <div className="d-none d-md-block text-end">
               <p className="small fw-medium mb-0">María Elena Contreras</p>
               <p className="text-muted-foreground small mb-0">FONASA B</p>
             </div>
             <div
               className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
               style={{ width: 40, height: 40 }}
             >
               <span className="text-white fw-medium">MC</span>
             </div>
           </div>
         </div>
       </div>
     </header>
   );
 }
