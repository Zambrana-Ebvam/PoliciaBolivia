// src/components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>PolBol Emergencias</h1>
        </Link>
        
        <nav>
          {user ? (
            // Usuario logueado
            <div className="user-nav">
              <span className="user-info">
                <strong>{user.firstName} {user.lastName}</strong>
                <span className="user-role">({user.role})</span>
              </span>
              
              {user.role === 'OPERATOR' && (
                <Link to="/operator" className="nav-link">Dashboard Operador</Link>
              )}
              {user.role === 'OFFICER' && (
                <Link to="/officer" className="nav-link">Mis Incidentes</Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/operator" className="nav-link">Dashboard Admin</Link>
              )}
              
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            // Usuario no logueado
            <div className="public-nav">
              <Link to="/login" className="nav-link">Ingresar al Sistema</Link>
              <a href="#quienes" className="nav-link">Quiénes Somos</a>
              <a href="#info" className="nav-link">Información</a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}