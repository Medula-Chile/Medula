import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

const I18N = {
    es: {
        help: "Ayuda",
        contact: "Contacto",
        language: "Idioma",

        hero_l1: "Tu historial médico",
        hero_l2: "siempre contigo",
        hero_sub_l1: "Accede a tus <strong>exámenes</strong>, <strong>medicamentos</strong> y <strong>citas</strong>",
        hero_sub_l2: "de manera simple y segura.",
        login: "Ingresar",

        feat_hist_title: "Historial Médico",
        feat_hist_desc: "Consulta diagnósticos y atenciones anteriores en un solo lugar.",
        feat_med_title: "Medicamentos",
        feat_med_desc: "Recibe alertas y gestiona tu stock de forma sencilla.",
        feat_lab_title: "Exámenes",
        feat_lab_desc: "Accede a resultados y compártelos con tus especialistas.",
        feat_rem_title: "Recordatorios",
        feat_rem_desc: "No olvides tus citas y tratamientos.",

        q_patient: "“Como paciente, tengo toda mi información de salud organizada y siempre a mano cuando la necesito.”",
        patient: "paciente",
        q_doctor: "“Como médico, tengo una visión clara y completa del historial de mis pacientes.”",
        doctor: "médico",

        cl1: "Protegido por ley y estándares de seguridad.",
        cl2: "Organiza y comparte información con tu médico solo cuando lo necesites.",
        cl3: "Ahorra tiempo con recordatorios y calendario integrados.",

        faq_title: "Preguntas Frecuentes",
        q1: "¿Qué es MEDULA?",
        a1: "Es tu portal personal para centralizar historial médico, exámenes, medicamentos y citas.",
        q2: "¿Es seguro?",
        a2: "Cumplimos normativa vigente y mejores prácticas de seguridad y privacidad.",
        q3: "¿Tiene costo?",
        a3: "La versión paciente es gratuita. Servicios adicionales pueden tener costos asociados.",
        q4: "¿Cómo accedo con Clave Única?",
        a4: "Pulsa “Ingresar” e intenta con tu ClaveÚnica para validar tu identidad (próximamente).",

        slogan: "cuida, organiza y protege.",
        protected: "Protegido por Ley 21.668. Tus datos siempre están seguros."
    },
    en: {
        help: "Help",
        contact: "Contact",
        language: "Language",

        hero_l1: "Your medical record",
        hero_l2: "always with you",
        hero_sub_l1: "Access your <strong>tests</strong>, <strong>medications</strong> and <strong>appointments</strong>",
        hero_sub_l2: "easily and securely.",
        login: "Sign in",

        feat_hist_title: "Medical History",
        feat_hist_desc: "View diagnoses and previous visits in one place.",
        feat_med_title: "Medications",
        feat_med_desc: "Get alerts and manage your stock easily.",
        feat_lab_title: "Lab Results",
        feat_lab_desc: "Access results and share them with your specialists.",
        feat_rem_title: "Reminders",
        feat_rem_desc: "Never miss appointments or treatments.",

        q_patient: "“As a patient, all my health information is organized and always at hand.”",
        patient: "patient",
        q_doctor: "“As a doctor, I have a clear and complete view of my patients’ medical history.”",
        doctor: "physician",

        cl1: "Protected by law and security standards.",
        cl2: "Organize and share with your doctor only when needed.",
        cl3: "Save time with reminders and integrated calendar.",

        faq_title: "Frequently Asked Questions",
        q1: "What is MEDULA?",
        a1: "Your personal portal to centralize medical history, tests, medications and appointments.",
        q2: "Is it secure?",
        a2: "We comply with applicable regulations and best security & privacy practices.",
        q3: "Does it cost anything?",
        a3: "The patient version is free. Additional services may have costs.",
        q4: "How do I log in with Clave Única?",
        a4: "Click “Sign in” and use your ClaveÚnica to validate your identity (coming soon).",

        slogan: "cares, organizes and protects.",
        protected: "Protected by Law 21.668. Your data is always safe."
    }
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
    const [lang, setLang] = useState('es')

    useEffect(() => {
        const saved = localStorage.getItem('medula:lang')
        if (saved) setLang(saved)
    }, [])

    useEffect(() => {
        localStorage.setItem('medula:lang', lang)
    }, [lang])

    const value = useMemo(() => {
        const dict = I18N[lang] || I18N.es
        const t = (key) => ({ text: dict[key] ?? '' })
        const raw = (key) => dict[key] ?? ''
        return { lang, setLang, t, raw }
    }, [lang])

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
    const ctx = useContext(LangContext)
    if (!ctx) throw new Error('useLang must be used within LangProvider')
    return ctx
}
