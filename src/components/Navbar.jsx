import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-bg" />
      <div className="navbar-overlay" />
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-tag">🏁 Official Technique Guide</span>
            <span className="logo-title">
              TrackMania <span>2020</span>
            </span>
          </Link>
        </div>
        <div className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/tecniche" className={({ isActive }) => isActive ? 'active' : ''}>Tecniche</NavLink>
          <NavLink to="/controller" className={({ isActive }) => isActive ? 'active' : ''}>Controller</NavLink>
          <NavLink to="/maps" className={({ isActive }) => isActive ? 'active' : ''}>Mappe Training</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profilo</NavLink>
        </div>
      </div>
    </nav>
  );
}
