import { useLang } from '../../contexts/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer id="contacto" className="py-5">
      <div className="container-xl text-center">
        <div className="logos mb-3">
          <a href="https://fonasa.cl" target="_blank" rel="noopener">
            <img src={import.meta.env.BASE_URL + 'Logo_de_Fonasa_clean.png'} alt="FONASA" />
          </a>
          <a href="https://minsal.cl" target="_blank" rel="noopener">
            <img src={import.meta.env.BASE_URL + 'Logo_del_MINSAL_Chile.png'} alt="MINSAL" />
          </a>
        </div>
        <p className="text-muted mb-2">{t('protected').text}</p>
        <a className="fw-800" href="mailto:contact@medula.cl">medulaservicio@gmail.com</a>
      </div>
    </footer>
  )
}
