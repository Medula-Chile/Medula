import { useLang } from '../../contexts/LangContext'
import { Link } from 'react-router-dom'

export default function Hero() {
  const { t, raw } = useLang()

  return (
    <section className="hero py-5 py-lg-6">
      <div className="container-xl">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h1 className="hero-title mb-3">
              <span>{t('hero_l1').text}</span><br />
              <span className="nowrap">{t('hero_l2').text}</span>
            </h1>

            <p className="hero-sub mb-4">
              <span dangerouslySetInnerHTML={{ __html: raw('hero_sub_l1') }} />
              <br />
              <span dangerouslySetInnerHTML={{ __html: raw('hero_sub_l2') }} />
            </p>

            <Link to="/auth/login" className="btn-grad btn-xl">
              {t('login').text}
            </Link>
          </div>

          <div className="col-12 col-lg-6 text-center">
            {/* Usa el nombre que tengas en /public. Si tu archivo se llama distinto, cámbialo aquí. */}
            <img
  src={import.meta.env.BASE_URL + 'hero.png'}
  alt="Profesional de la salud atiende a paciente frente al computador"
  className="hero-illustration img-fluid"
/>
          </div>
        </div>
      </div>
    </section>
  )
}
