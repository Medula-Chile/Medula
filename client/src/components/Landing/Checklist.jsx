import { useLang } from '../../contexts/LangContext'

export default function Checklist() {
  const { t } = useLang()
  return (
    <section id="checklist" className="pb-4 pb-lg-5">
      <div className="container-xl">
        <div className="row">
          <div className="col-12 col-lg-10 mx-auto">
            <ul className="checklist">
              <li>{t('cl1').text}</li>
              <li>{t('cl2').text}</li>
              <li>{t('cl3').text}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
