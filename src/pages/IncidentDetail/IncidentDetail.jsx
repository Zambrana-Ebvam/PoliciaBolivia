// src/pages/IncidentDetail/IncidentDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { incidentsService } from '../../services/incidents';
import { officersService } from '../../services/officers';
import StatusBadge from '../../components/incidents/StatusBadge';
import MapView from '../../components/common/MapView';
import IncidentTracking from '../../components/incidents/IncidentTracking';
import './IncidentDetail.css';

export default function IncidentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [incident, setIncident] = useState(null);
  const [nearbyOfficers, setNearbyOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [error, setError] = useState('');
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    loadIncident();
  }, [id]);

  useEffect(() => {
    updateMapMarkers();
  }, [incident, nearbyOfficers]);

  const loadIncident = async () => {
    try {
      setLoading(true);
      const incidentData = await incidentsService.getIncidentById(id);
      setIncident(incidentData);
    } catch (error) {
      console.error('Error cargando incidente:', error);
      setError('No se pudo cargar el incidente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearbyOfficers = async () => {
    if (!incident?.initialLocation?.coordinates) {
      alert('El incidente no tiene ubicación válida.');
      return;
    }
    
    try {
      setLoadingOfficers(true);
      const [lon, lat] = incident.initialLocation.coordinates;
      const officersFound = await officersService.getNearbyOfficers(lon, lat);
      
      const normalizedOfficers = officersFound.map(item => {
        const userData = item.user || {}; 
        return {
          ...userData,
          _id: item.userId || userData._id, 
          distance: item.dist || item.distance || 0,
          coords: item.coords,
          location: item.coords,
          isAvailable: userData.isAvailable ?? true
        };
      });
      
      setNearbyOfficers(normalizedOfficers);
    } catch (error) {
      console.error('Error buscando oficiales:', error);
      alert('Error al buscar oficiales cercanos.');
    } finally {
      setLoadingOfficers(false);
    }
  };

  const handleAssignOfficer = async (officerId) => {
    if (!window.confirm('¿Estás seguro de asignar este oficial?')) return;

    try {
      const updatedIncident = await incidentsService.assignOfficer(incident._id, officerId);
      alert('✅ Oficial asignado correctamente');
      setIncident(updatedIncident);
    } catch (error) {
      console.error('Error asignando oficial:', error);
      alert('❌ Error al asignar oficial: ' + (error.response?.data?.message || error.message));
    }
  };

  // --- FUNCIÓN DE MARCADORES MEJORADA CON POPUPS BONITOS ---
  const updateMapMarkers = () => {
    if (!incident) return;
    const markers = [];

    // A) MARCADOR INCIDENTE
    if (incident.initialLocation?.coordinates) {
      const [lon, lat] = incident.initialLocation.coordinates;
      markers.push({
        position: [lat, lon],
        type: 'incident',
        title: 'Ubicación del Incidente',
        // Usamos HTML estructurado con clases para el popup
        popup: `
          <div class="custom-popup-content popup-incident">
            <div class="popup-header">🚨 ${getEmergencyTypeLabel(incident.emergencyTypeCode)}</div>
            <div class="popup-body">
                <strong>Estado:</strong> ${incident.status}<br/>
                <small class="popup-date">${formatDate(incident.createdAt)}</small>
            </div>
          </div>
        `
      });
    }

    // B) OFICIALES CERCANOS
    nearbyOfficers.forEach((officer) => {
      const location = officer.coords || officer.location;
      if (location?.coordinates) {
        const [lon, lat] = location.coordinates;
        if (incident.assignedOfficerId && incident.assignedOfficerId._id === officer._id) return;

        markers.push({
          position: [lat, lon],
          type: 'officer',
          title: `👮 ${officer.policeRank} ${officer.firstName}`,
          popup: `
            <div class="custom-popup-content popup-officer">
               <div class="popup-header">👮 ${officer.policeRank}</div>
               <div class="popup-body">
                  <strong>${officer.firstName} ${officer.lastName}</strong><br/>
                  Distancia: ${Math.round(officer.distance)}m<br/>
                  <span class="popup-status ${officer.isAvailable ? 'available' : 'unavailable'}">
                      ${officer.isAvailable ? '✅ Disponible' : '❌ Ocupado'}
                  </span>
               </div>
            </div>
          `
        });
      }
    });

    // C) OFICIAL ASIGNADO
    if (incident.assignedOfficerId) {
      const officer = incident.assignedOfficerId;
      let officerLoc = officer.location; 
      if (!officerLoc && incident.assignees?.length > 0) {
         const lastAssign = incident.assignees.find(a => a.officerId._id === officer._id);
         if (lastAssign?.officerId?.location) officerLoc = lastAssign.officerId.location;
      }

      if (officerLoc?.coordinates) {
        const [lon, lat] = officerLoc.coordinates;
        markers.push({
          position: [lat, lon],
          type: 'officer',
          title: `🎯 ASIGNADO: ${officer.firstName}`,
          popup: `
            <div class="custom-popup-content popup-assigned">
               <div class="popup-header">🎯 OFICIAL ASIGNADO</div>
               <div class="popup-body">
                   <strong>${officer.policeRank} ${officer.firstName} ${officer.lastName}</strong><br/>
                   <span class="popup-badge">En camino</span><br/>
                   <small>Escalafón: ${officer.escalafon || 'N/A'}</small>
               </div>
            </div>
          `
        });
      }
    }
    setMapMarkers(markers);
  };

  // --- HELPER DE DETALLES MEJORADO (Adios JSON feo) ---
  const renderDetails = (details) => {
    if (!details) return <span className="no-details">Sin detalles adicionales.</span>;
    if (typeof details === 'string') return <p className="details-text">{details}</p>;

    if (typeof details === 'object') {
      // Extraemos los campos conocidos para mostrarlos bonito
      const { description, msg, mensaje, message, app, createdAt, ...otherFields } = details;
      const mainMsg = description || msg || mensaje || message;

      return (
        <div className="details-structured">
          {mainMsg && <p className="details-main-msg">"{mainMsg}"</p>}
          
          <div className="details-meta-grid">
             {app && (
               <div className="meta-item">
                 <span className="meta-label">Origen:</span>
                 <span className="meta-value">{app.replace('MOBILE_', 'App ')}</span>
               </div>
             )}
             {createdAt && (
               <div className="meta-item">
                 <span className="meta-label">Reportado:</span>
                 <span className="meta-value">{formatDate(createdAt)}</span>
               </div>
             )}
             {/* Si hay otros campos raros, los mostramos al final */}
             {Object.entries(otherFields).map(([key, value]) => (
                <div className="meta-item" key={key}>
                  <span className="meta-label">{key}:</span>
                  <span className="meta-value">{String(value)}</span>
                </div>
             ))}
          </div>
        </div>
      );
    }
    return JSON.stringify(details);
  };

  const getEmergencyTypeLabel = (typeCode) => {
    const types = { 'ROBO': 'Robo / Asalto', 'ROBBERY': 'Robo', 'ACCIDENT': 'Accidente', 'MEDICAL': 'Emergencia Médica', 'FIRE': 'Incendio', 'ASSAULT': 'Asalto', 'OTHER': 'Otro' };
    return types[typeCode] || typeCode;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-BO', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) return <div className="incident-detail-loading"><div className="loading-spinner">Cargando incidente...</div></div>;
  if (error) return <div className="incident-detail-error"><h2>Error</h2><p>{error}</p><Link to="/operator" className="back-link">Volver al Dashboard</Link></div>;
  if (!incident) return <div className="incident-detail-not-found"><h2>Incidente no encontrado</h2><Link to="/operator" className="back-link">Volver al Dashboard</Link></div>;

  return (
    <div className="incident-detail">
      <div className="detail-header">
        <Link to="/operator" className="back-link">← Volver al Dashboard</Link>
        <h1>Detalle del Incidente #{incident._id.slice(-6)}</h1>
      </div>

      <div className="detail-content">
        <div className="incident-info-card">
          <h2>Información del Incidente</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Tipo de Emergencia:</label>
              <span className="info-value emergency-type">{getEmergencyTypeLabel(incident.emergencyTypeCode)}</span>
            </div>
            <div className="info-item">
              <label>Estado:</label>
              <span className="info-value"><StatusBadge status={incident.status} /></span>
            </div>
            <div className="info-item">
              <label>Fecha de Creación:</label>
              <span className="info-value">{formatDate(incident.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Solicitante:</label>
              <span className="info-value">
                {incident.requesterId?.firstName} {incident.requesterId?.lastName} <br/>
                <small style={{ opacity: 0.8 }}>{incident.requesterId?.phoneNumber}</small>
              </span>
            </div>

            <div className="info-item full-width">
              <label>Detalles Adicionales:</label>
              <div className="info-value">
                {renderDetails(incident.details)}
              </div>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>Gestión Táctica</h3>
          <div className="action-buttons">
            <button onClick={handleFindNearbyOfficers} disabled={loadingOfficers || !incident?.initialLocation?.coordinates} className="btn btn-primary">
              {loadingOfficers ? 'Buscando...' : '🔍 Buscar Oficiales Cercanos'}
            </button>
          </div>
          {nearbyOfficers.length > 0 && (
            <div className="nearby-officers">
              <h4>Oficiales Cercanos ({nearbyOfficers.length})</h4>
              <div className="officers-list">
                {nearbyOfficers.map((officer) => (
                  <div key={officer._id} className="officer-card">
                    <div className="officer-main-info">
                      <div className="officer-name-rank">
                        <strong className="officer-rank">{officer.policeRank}</strong>
                        <span className="officer-name">{officer.firstName} {officer.lastName}</span>
                      </div>
                      <div className="officer-distance">
                        {officer.distance < 1000 ? `${Math.round(officer.distance)} m` : `${(officer.distance / 1000).toFixed(2)} km`}
                      </div>
                    </div>
                    <div className="officer-secondary-info">
                      <span className={`availability ${officer.isAvailable ? 'available' : 'unavailable'}`}>
                        {officer.isAvailable ? '✅ Disponible' : '❌ Ocupado'}
                      </span>
                      {officer.escalafon && <span className="escalafon">Esc: {officer.escalafon}</span>}
                    </div>
                    <button className="btn-assign" onClick={() => handleAssignOfficer(officer._id)} disabled={!officer.isAvailable || incident.assignedOfficerId?._id === officer._id}>
                      {incident.assignedOfficerId?._id === officer._id ? 'Asignado' : 'Asignar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="map-section">
          <h3>Mapa de Ubicaciones</h3>
          <div className="map-legend">
            <div className="legend-item"><div className="legend-color legend-incident"></div><span>Incidente</span></div>
            <div className="legend-item"><div className="legend-color legend-officer"></div><span>Oficiales</span></div>
          </div>
          <MapView markers={mapMarkers} height="400px" />
          {incident?.initialLocation?.coordinates && (
            <p className="coordinates-info">Coordenadas: {incident.initialLocation.coordinates[1].toFixed(6)}, {incident.initialLocation.coordinates[0].toFixed(6)}</p>
          )}
        </div>

        {incident.status !== 'RESOLVED' && incident.status !== 'CANCELLED' && (
          <div className="tracking-section">
            <IncidentTracking incidentId={incident._id} incidentLocation={incident.initialLocation} incidentStatus={incident.status} />
          </div>
        )}
      </div>
    </div>
  );
}