import Header from '../components/Landing/Header'
import Hero from '../components/Landing/Hero'
import Features from '../components/Landing/Features'
import Testimonials from '../components/Landing/Testimonials'
import Checklist from '../components/Landing/Checklist'
import FAQ from '../components/Landing/FAQ'
import Footer from '../components/Landing/Footer'
import '../styles.css'

export default function LandingPage() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Features />
                <Testimonials />
                <Checklist />
                <FAQ />
            </main>
            <Footer />
        </>
    )
}
