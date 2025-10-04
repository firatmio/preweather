import { Outlet } from 'react-router-dom'
import CookieConsent from './components/CookieConsent/CookieConsent'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <CookieConsent />
      <Footer />
    </>
  )
}
