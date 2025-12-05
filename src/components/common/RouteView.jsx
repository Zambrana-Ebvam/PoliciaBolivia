import { useEffect } from 'react';
import L from 'leaflet';

// Variable para controlar la línea actual fuera del ciclo de renderizado de React
let currentPolyline = null;

export default function RouteView({ 
  mapInstance, 
  incidentLocation, 
  officerLocation,
  enabled = true 
}) {
  useEffect(() => {
    if (!mapInstance || !enabled) return;

    // 1. Limpiar línea anterior si existe
    if (currentPolyline) {
      try { mapInstance.removeLayer(currentPolyline); } catch (e) {}
      currentPolyline = null;
    }

    // 2. Validar que tenemos ambas coordenadas
    const hasInc = incidentLocation?.coordinates && Array.isArray(incidentLocation.coordinates);
    const hasOff = officerLocation?.coordinates && Array.isArray(officerLocation.coordinates);

    if (hasInc && hasOff) {
      const [incLon, incLat] = incidentLocation.coordinates;
      const [offLon, offLat] = officerLocation.coordinates;

      // Leaflet usa [Lat, Lon]
      const routeCoords = [
        [offLat, offLon], // Origen (Oficial)
        [incLat, incLon]  // Destino (Incidente)
      ];

      // 3. Dibujar la línea
      currentPolyline = L.polyline(routeCoords, {
        color: '#e74c3c',   // Rojo
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10', // Punteada
        lineJoin: 'round'
      }).addTo(mapInstance);

      // 4. Ajustar el zoom para ver toda la ruta
      try {
        const bounds = currentPolyline.getBounds();
        if (bounds.isValid()) {
          mapInstance.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {
        console.warn("Error ajustando zoom de ruta", e);
      }
    }

    // Cleanup al desmontar
    return () => {
      if (currentPolyline && mapInstance) {
        try { mapInstance.removeLayer(currentPolyline); } catch (e) {}
      }
    };
  }, [mapInstance, incidentLocation, officerLocation, enabled]);

  return null; // Este componente no renderiza HTML, solo manipula el mapa
}