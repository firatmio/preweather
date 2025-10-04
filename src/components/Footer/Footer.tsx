import { FaRegCopyright } from 'react-icons/fa';
import { useLocation } from 'react-router';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div className={`footer ${isHome && "home"}`}>
      PreWeather <FaRegCopyright /> {year}.
    </div>
  )
}
