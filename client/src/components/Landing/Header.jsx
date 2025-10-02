import { useLang } from '../../contexts/LangContext'
import { Link } from 'react-router-dom'

export default function Header() {
  const { t, lang, setLang } = useLang()

  return (
    <header className="navbar navbar-expand-lg bg-white sticky-top shadow-xs">
      <div className="container-xl align-items-center">
        {/* Logo grande */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img
            src={import.meta.env.BASE_URL + 'medula_largo.png'}
            alt="MEDULA"
            className="logo-lg"
          />
          <span className="visually-hidden">MEDULA</span>
        </a>

        <nav className="ms-auto d-none d-lg-flex align-items-center">
          <ul className="navbar-nav me-3 gap-3 align-items-center">
            <li className="nav-item">
              <a href="/auth/login" className="nav-link">Iniciar Sesión</a>
            </li>
            <li className="nav-item">
              <a href="/auth/register" className="nav-link">Registrarse</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#faq">{t('help').text}</a>
            </li>
            <li className="nav-item">
              <a href="/auth/register" className="nav-link">{t('contact').text}</a>
            </li>
          </ul>

          {/* Idioma desktop */}
          <div className="dropdown">
            <button
              className="btn btn-outline-primary fw-700 rounded-3"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="me-1">🌐</span>
              <span>{(lang || 'es').toUpperCase()}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li>
                <button
                  className={`dropdown-item ${lang === 'es' ? 'active' : ''}`}
                  onClick={() => setLang('es')}
                >
                  ES — Español
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN — English
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Hamburguesa mobile */}
        <div className="dropdown ms-auto d-lg-none">
          <button
            className="btn btn-icon"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow menu-pop">
            <li className="nav-item">
              <a href="/auth/login" className="nav-link">Iniciar Sesión</a>
            </li>
            <li className="nav-item">
              <a href="/auth/register" className="nav-link">Registrarse</a>
            </li>
            <li>
              <a className="dropdown-item py-2 fw-700" href="#faq">
                {t('help').text}
              </a>
            </li>
            <li>
              <a className="dropdown-item py-2 fw-700" href="#contacto">
                {t('contact').text}
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li className="px-3 pt-1 pb-2">
              <div className="small text-muted mb-1 fw-700">
                {t('language').text}
              </div>
              <div className="list-group list-group-sm">
                <button
                  className={`list-group-item list-group-item-action ${lang === 'es' ? 'active' : ''}`}
                  onClick={() => setLang('es')}
                >
                  ES — Español
                </button>
                <button
                  className={`list-group-item list-group-item-action ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN — English
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
