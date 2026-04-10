import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">Web<span>lyne</span></NavLink>
      <ul className="nav-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : ''}>Pricing</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
        <li><NavLink to="/contact" className="nav-cta">Get a quote</NavLink></li>
      </ul>
    </nav>
  )
}
