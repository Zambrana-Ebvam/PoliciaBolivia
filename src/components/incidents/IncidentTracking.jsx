// src/components/incidents/IncidentTracking.jsx
import { useState } from 'react';
import { useIncidentTracking } from '../../hooks/useIncidentTracking';
import MapView from '../common/MapView';
import './IncidentTracking.css';

export default function IncidentTracking({ incidentId, incidentLocation, incidentStatus }) {
  const { trackingData, loading, lastUpdate, forceRefresh } = useIncidentTracking(incidentId);
  const [showRoute, setShowRoute] = useState(true);

  // --- 1. FUNCIÓN MATEMÁTICA PARA CALCULAR DISTANCIA (NUEVO) ---
  // Fórmula de Haversine para calcular distancia entre dos puntos GPS en metros
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la tierra en metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en metros
  };

  // --- LÓGICA DE MARCADORES ---
  const getMapMarkers = () => {
    const markers = [];
    
    // Solicitante
    const civilLoc = trackingData?.civil?.location || incidentLocation;
    if (civilLoc?.coordinates) {
      const [lon, lat] = civilLoc.coordinates;
      markers.push({
        position: [lat, lon],
        type: 'incident',
        title: 'Solicitante',
        popup: `
          <strong>👤 Solicitante</strong><br/>
          ${trackingData?.civil?.name || 'Civil'}<br/>
          <i>${trackingData?.civil?.phone || ''}</i>
        `
      });
    }

    // Oficial
    if (trackingData?.officer?.location?.coordinates) {
      const [lon, lat] = trackingData.officer.location.coordinates;
      markers.push({
        position: [lat, lon],
        type: 'officer',
        title: 'Unidad Policial',
        popup: `
          <strong>🚔 Unidad Asignada</strong><br/>
          ${trackingData.officer.name}<br/>
          Estado: En movimiento
        `
      });
    }

    return markers;
  };

  // --- 2. MOSTRAR DISTANCIA (MEJORADO) ---
  const getDistanceDisplay = () => {
    let dist = trackingData?.distance;

    // SI EL BACKEND NO MANDA DISTANCIA, LA CALCULAMOS AQUÍ:
    if (!dist && trackingData?.officer?.location?.coordinates && incidentLocation?.coordinates) {
        const [offLon, offLat] = trackingData.officer.location.coordinates;
        // Usamos la ubicación del civil en tiempo real si existe, sino la inicial
        const civilCoords = trackingData?.civil?.location?.coordinates || incidentLocation.coordinates;
        const [civLon, civLat] = civilCoords;
        
        // Calculamos manualmente
        dist = calculateDistance(offLat, offLon, civLat, civLon);
    }

    if (typeof dist === 'number') {
      return dist < 1000 
        ? `${Math.round(dist)} m` 
        : `${(dist / 1000).toFixed(2)} km`;
    }
    
    return '--';
  };

  // --- PANTALLA DE CARGA ---
  if (loading && !trackingData) {
    return (
      <div className="incident-tracking-panel">
        <div className="tracking-loading">
          <div className="loading-spinner"></div>
          <p>Estableciendo enlace satelital...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="incident-tracking-panel">
      
      {/* HEADER */}
      <div className="tracking-header">
        <div className="live-indicator">
          <span className="pulsing-dot"></span>
          SEGUIMIENTO TÁCTICO EN VIVO
        </div>
        <div className="header-actions">
           <span className="last-update">
            Actualizado: {lastUpdate ? lastUpdate.toLocaleTimeString() : '...'}
          </span>
          <button onClick={forceRefresh} className="btn-refresh" title="Actualizar datos">
            ↻
          </button>
        </div>
      </div>

      {/* TARJETAS */}
      <div className="connection-panel">
        
        {/* CIVIL */}
        <div className="entity-card civil-card">
          <div className="avatar civil-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="entity-info">
            <h4>Solicitante</h4>
            <p className="entity-name">{trackingData?.civil?.name || 'Ciudadano'}</p>
            <span className="status-badge active">Esperando</span>
          </div>
        </div>

        {/* DISTANCIA (Ahora siempre mostrará el cálculo) */}
        <div className="route-info">
          <div className="distance-badge">
            <span className="dist-label">Distancia Aprox.</span>
            <span className="dist-value">{getDistanceDisplay()}</span>
          </div>
          {trackingData?.officer && <div className="dashed-line"></div>}
        </div>

        {/* OFICIAL */}
        <div className="entity-card officer-card">
          <div className="avatar officer-avatar">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div className="entity-info">
            <h4>Unidad Asignada</h4>
            <p className="entity-name">{trackingData?.officer?.name || 'Buscando...'}</p>
            <span className={`status-badge ${trackingData?.officer ? 'assigned' : 'searching'}`}>
              {trackingData?.officer ? 'En Camino 🚔' : 'Asignando...'}
            </span>
          </div>
        </div>
      </div>

      {/* MAPA */}
      <div className="tracking-map-container">
        <div className="map-controls">
          <label className="route-toggle">
            <input 
              type="checkbox" 
              checked={showRoute}
              onChange={(e) => setShowRoute(e.target.checked)}
            />
            <span>Mostrar ruta de aproximación</span>
          </label>
        </div>
        
        <MapView 
          markers={getMapMarkers()}
          height="450px"
          showRoute={showRoute}
          incidentLocation={incidentLocation}
          officerLocation={trackingData?.officer?.location}
        />
      </div>
    </div>
  );
}