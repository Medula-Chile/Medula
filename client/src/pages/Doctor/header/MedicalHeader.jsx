import './MedicalHeader.css'
import { useState } from 'react';
// Encabezado del Portal del Médico.
// Props:
// - onToggleSidebar: función para abrir/cerrar el menú lateral en dispositivos pequeños.
function Header({ onToggleSidebar }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de búsqueda
        console.log('Buscando:', searchQuery);
        // Por ejemplo, podrías llamar a una función de búsqueda pasada como prop
        // if (onSearch) onSearch(searchQuery);
    };

    return (
        <>
        <header className="bg-white border-bottom border-gray-200 px-3 px-md-4 py-3">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <button
                      className="btn btn-ghost d-lg-none me-2"
                      type="button"
                      id="sidebarToggle"
                      aria-label="Abrir menú lateral"
                      onClick={onToggleSidebar}
                    >
                    <i className="fas fa-bars" />
                    </button>
                    <div className="d-flex align-items-center gap-3">
                        <img
                          src="/medula_icono.png"
                          alt="Medula"
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain' }}
                        />
                        <div>
                            <h1 className="h5 mb-0 fw-bold text-primary">MEDULA</h1>
                            <p className="text-muted-foreground small mb-0">
                            Portal del Médico
                            </p>
                        </div>
                    </div>
                </div>
              {/* Barra de búsqueda centrada */}
                <div className="d-none d-md-flex flex-grow-1 justify-content-center">
                    <div className="w-100" style={{ maxWidth: '400px' }}>
                        <form onSubmit={handleSearch} className="d-flex align-items-center">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar paciente por nombre o rut"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Buscar en el portal médico"
                                />
                                <button 
                                    className="btn btn-primary" 
                                    type="submit"
                                    aria-label="Ejecutar búsqueda"
                                >
                                    <i className="fas fa-search" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-md-flex align-items-center gap-2">
                        <i className="fas fa-shield-alt text-success" />
                        <span className="custom-badge border-success text-success">
                        Conexión Segura
                        </span>
                    </div>
                    <button className="btn btn-ghost position-relative">
                    <i className="fas fa-bell" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-destructive">
                        2
                    </span>
                    </button>
                   
                    <div className="d-flex align-items-center gap-3 ps-3 border-start border-gray-200">
                        <div className="d-none d-md-block text-end">
                            <p className="small fw-medium mb-0">María Elena Contreras</p>
                            <p className="text-muted-foreground small mb-0">FONASA B</p>
                        </div>
                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                            <span className="text-white fw-medium">MC</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        </>
    )
}

export default Header