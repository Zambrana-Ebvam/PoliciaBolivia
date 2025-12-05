// src/components/incidents/IncidentTable.jsx
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './IncidentTable.css';

export default function IncidentTable({ incidents, loading }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-BO');
  };

  const getEmergencyTypeLabel = (typeCode) => {
    const types = {
      'ROBO': 'Robo / Asalto',
      'VIOLENCIA': 'Violencia / Agresión',
      'ACCIDENTE': 'Accidente de tránsito',
      'INCENDIO': 'Incendio',
      'SALUD': 'Emergencia médica',
      'PERSONA_SOSPECHOSA': 'Persona sospechosa',
      'OTRO': 'Otro'
    };
    return types[typeCode] || typeCode;
  };

  if (loading) {
    return (
      <div className="loading-incidents">
        <div className="loading-spinner">Cargando incidentes...</div>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="no-incidents">
        <p>No hay incidentes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="incident-table-container">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Tipo Emergencia</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Solicitante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident._id} className="incident-row">
              <td className="emergency-type">
                {getEmergencyTypeLabel(incident.emergencyTypeCode)}
              </td>
              <td>
                <StatusBadge status={incident.status} />
              </td>
              <td className="created-at">
                {formatDate(incident.createdAt)}
              </td>
              <td className="requester">
                {incident.requesterId ? (
                  <div className="requester-info">
                    <div className="requester-name">
                      {incident.requesterId.firstName} {incident.requesterId.lastName}
                    </div>
                    {incident.requesterId.phoneNumber && (
                      <div className="requester-phone">
                        📞 {incident.requesterId.phoneNumber}
                      </div>
                    )}
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="actions">
                <Link 
                  to={`/operator/incidents/${incident._id}`}
                  className="btn-view"
                >
                  Ver Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}