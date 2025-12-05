// src/pages/OfficerDashboard/OfficerDashboard.jsx
import { useAuth } from '../../hooks/useAuth';
import './OfficerDashboard.css';

export default function OfficerDashboard() {
  const { user } = useAuth();

  return (
    <div className="officer-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Oficial</h1>
        <p>Bienvenido/a, {user.policeRank} {user.firstName} {user.lastName}</p>
        <p>Escalafón: {user.escalafon}</p>
      </div>
      
      <div className="dashboard-content">
        <div className="placeholder-section">
          <h2>Mis Incidentes Asignados</h2>
          <p>Aquí se mostrarán los incidentes asignados a ti...</p>
        </div>
      </div>
    </div>
  );
}