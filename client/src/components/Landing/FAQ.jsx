import { useLang } from '../../contexts/LangContext'

export default function FAQ() {
  const { t } = useLang()
  return (
    <section id="faq" className="py-4 py-lg-5">
      <div className="container-xl">
        <h2 className="section-title mb-3">{t('faq_title').text}</h2>

        <div className="accordion shadow-sm rounded-3 overflow-hidden" id="faqAcc">
          <div className="accordion-item">
            <h2 className="accordion-header" id="q1h">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q1" aria-expanded="true" aria-controls="q1">
                {t('q1').text}
              </button>
            </h2>
            <div id="q1" className="accordion-collapse collapse show" aria-labelledby="q1h" data-bs-parent="#faqAcc">
              <div className="accordion-body">
                {t('a1').text}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="q2h">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q2" aria-expanded="false" aria-controls="q2">
                {t('q2').text}
              </button>
            </h2>
            <div id="q2" className="accordion-collapse collapse" aria-labelledby="q2h" data-bs-parent="#faqAcc">
              <div className="accordion-body">
                {t('a2').text}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="q3h">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q3" aria-expanded="false" aria-controls="q3">
                {t('q3').text}
              </button>
            </h2>
            <div id="q3" className="accordion-collapse collapse" aria-labelledby="q3h" data-bs-parent="#faqAcc">
              <div className="accordion-body">
                {t('a3').text}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="q4h">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#q4" aria-expanded="false" aria-controls="q4">
                {t('q4').text}
              </button>
            </h2>
            <div id="q4" className="accordion-collapse collapse" aria-labelledby="q4h" data-bs-parent="#faqAcc">
              <div className="accordion-body">
                {t('a4').text}
              </div>
            </div>
          </div>
        </div>

        <div className="slogan-cta mt-4 text-center">
          <p className="slogan m-0"><strong>MEDULA</strong>, {t('slogan').text}</p>
        </div>
      </div>
    </section>
  )
}
