import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content container-xl d-flex align-items-center justify-content-between">
        <div className="logo-section d-flex align-items-center gap-3">
          <img src="/medula_largo.png" alt="Medula" width={160} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <nav className="d-flex align-items-center gap-4">
          <a href="/help" className="nav-link">Ayuda</a>
          <a href="/contact" className="nav-link">Contacto</a>
          <button className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="fas fa-globe"></i> ES
          </button>
        </nav>
      </div>
    </header>
  )
}
