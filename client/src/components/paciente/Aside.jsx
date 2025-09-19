 import React from 'react';

 export default function Aside({ isOpen, onClose, onLogout }) {
   return (
     <>
       {/* Overlay móvil */}
       <div
         className={`overlay ${isOpen ? 'show' : ''}`}
         onClick={onClose}
         role="button"
         aria-label="Cerrar menú lateral"
       />
       <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
         {/*<div className="p-3 p-md-4">
           <div className="bg-success-10 border border-success-20 rounded-lg p-3 mb-4">
             <div className="d-flex align-items-center gap-2 mb-2">
               <i className="fas fa-heart text-success"></i>
               <span className="small fw-medium text-success">Estado de Salud</span>
             </div>
             <div className="d-flex flex-column gap-1">
               <div className="d-flex justify-content-between small">
                 <span className="text-muted-foreground">Última consulta</span>
                 <span className="fw-medium">15 Ago 2024</span>
               </div>
               <div className="d-flex justify-content-between small">
                 <span className="text-muted-foreground">Medicamentos activos</span>
                 <span className="custom-badge bg-success text-white border-success px-1 py-0">3</span>
               </div>
             </div>
           </div>
         </div>*/}

         <nav className="flex-grow-1 px-3 px-md-4" style={{marginTop: '20px'}}>
           <div className="d-flex flex-column gap-1">
             <a href="03-Historial.html" className="nav-link active">
               <i className="fas fa-history"></i>
               <span>Mi Historial</span>
             </a>
             <a href="04-Medicamentos.html" className="nav-link">
               <i className="fas fa-pills"></i>
               <span>Mis Medicamentos</span>
             </a>
             <a href="05-Examenes.html" className="nav-link">
               <i className="fas fa-vial"></i>
               <span>Mis Exámenes</span>
             </a>
             <a href="06-Recetas.html" className="nav-link">
               <i className="fas fa-download"></i>
               <span>Recetas</span>
             </a>
             <a href="07-Centro.html" className="nav-link">
               <i className="fas fa-hospital"></i>
               <span>Centro Médico</span>
             </a>
             <a href="08-Perfil.html" className="nav-link">
               <i className="fas fa-user"></i>
               <span>Mi Perfil</span>
             </a>
             <a href="09-Configuracion.html" className="nav-link">
               <i className="fas fa-cog"></i>
               <span>Configuración</span>
             </a>
           </div>

           <hr className="my-4" />

           <div className="d-flex flex-column gap-1" style={{marginBottom: '20px'}}>
             <button className="nav-link btn btn-link text-start p-0" onClick={onLogout}>
               <i className="fas fa-sign-out-alt"></i>
               <span className="ms-2">Cerrar Sesión</span>
             </button>
           </div>
         </nav>

         <div className="p-3 p-md-4 border-top border-gray-200">
           <div className="text-center text-muted-foreground small">
             <p className="mb-1">Protegido por Ley 21.668</p>
             <div className="d-flex justify-content-center gap-2">
               <span className="custom-badge border px-1 py-0">FONASA</span>
               <span className="custom-badge border px-1 py-0">MINSAL</span>
             </div>
           </div>
         </div>
       </aside>
     </>
   );
 }
