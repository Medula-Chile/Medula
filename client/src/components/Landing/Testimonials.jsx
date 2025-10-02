import { useLang } from '../../contexts/LangContext'

export default function Testimonials() {
  const { t } = useLang()
  return (
    <section className="pb-3 pb-lg-4">
      <div className="container-xl">
        <div className="row g-3 g-lg-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <figure className="quote flex-fill h-100">
              <blockquote>{t('q_patient').text}</blockquote>
              <figcaption>María G., <span>{t('patient').text}</span></figcaption>
            </figure>
          </div>
          <div className="col-12 col-lg-6 d-flex">
            <figure className="quote flex-fill h-100">
              <blockquote>{t('q_doctor').text}</blockquote>
              <figcaption>Dr. Vega, <span>{t('doctor').text}</span></figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
