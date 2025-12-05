import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RouteView from './RouteView'; // <--- Importamos el componente de arriba

// Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generador de iconos
const createCustomIcon = (color, zIndexOffset = 0, isPulsing = false) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: ${isPulsing ? '28px' : '24px'}; 
        height: ${isPulsing ? '28px' : '24px'}; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ${isPulsing ? 'animation: pulse 2s infinite;' : ''}
      "></div>
      ${isPulsing ? `<style>@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }</style>` : ''}
    `,
    iconSize: isPulsing ? [28, 28] : [24, 24],
    className: 'custom-marker',
    iconAnchor: isPulsing ? [14, 14] : [12, 12],
    popupAnchor: [0, -12],
    zIndexOffset: zIndexOffset
  });
};

const incidentIcon = createCustomIcon('#e74c3c', 1000, true); // Rojo pulsante
const officerIcon = createCustomIcon('#3498db', 100, false);  // Azul
const civilIcon = createCustomIcon('#2ecc71', 50, false);     // Verde

export default function MapView({ 
  markers = [],
  height = '400px',
  showRoute = false,
  incidentLocation = null,
  officerLocation = null
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // 1. Inicializar Mapa
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Evitar reinicializar
    if (!mapInstanceRef.current) {
      // Coordenadas default (La Paz)
      const defaultCenter = [-16.4897, -68.1193];
      
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      setMapReady(true);
    }
  }, []);

  // 2. Gestionar Marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpiar marcadores viejos
    markersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    markersRef.current = [];

    // Filtrar válidos
    const validMarkers = markers.filter(m => 
      m.position && Array.isArray(m.position) && m.position.length === 2 && !isNaN(m.position[0])
    );

    if (validMarkers.length === 0) return;

    // Poner incidente primero para el Z-Index
    const incidentM = validMarkers.find(m => m.type === 'incident');
    const othersM = validMarkers.filter(m => m.type !== 'incident');
    const ordered = incidentM ? [incidentM, ...othersM] : othersM;

    // Pintar nuevos marcadores
    ordered.forEach(marker => {
      let icon = marker.type === 'incident' ? incidentIcon : (marker.type === 'officer' ? officerIcon : civilIcon);
      
      const leafMarker = L.marker(marker.position, { icon })
        .addTo(mapInstanceRef.current)
        .bindTooltip(marker.title || '');

      if (marker.popup) leafMarker.bindPopup(marker.popup);
      
      markersRef.current.push(leafMarker);
    });

    // Ajustar vista (Solo si NO hay ruta activa, porque la ruta tiene prioridad de zoom)
    if (!showRoute && validMarkers.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }

  }, [markers, showRoute]);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        ref={mapRef} 
        style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }} 
      />
      
      {/* Aquí inyectamos la lógica de la ruta */}
      {mapReady && showRoute && (
        <RouteView 
          mapInstance={mapInstanceRef.current}
          incidentLocation={incidentLocation}
          officerLocation={officerLocation}
          enabled={showRoute}
        />
      )}
    </div>
  );
}