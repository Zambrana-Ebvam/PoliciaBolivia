import { useState, useEffect, useRef } from 'react';
import { incidentsService } from '../services/incidents';

// Función auxiliar para normalizar datos
const normalizeTrackingData = (rawData) => {
  if (!rawData) return null;
  
  let civil = null;
  let officer = null;
  
  // 1. Normalizar CIVIL
  if (rawData.civil) {
    civil = {
      name: rawData.civil.name || rawData.civil.firstName || 'Civil',
      phone: rawData.civil.phone || rawData.civil.phoneNumber,
      location: rawData.civil.location || rawData.civil.coords,
    };
  } else if (rawData.requester) {
    civil = {
      name: `${rawData.requester.firstName || ''} ${rawData.requester.lastName || ''}`.trim() || 'Solicitante',
      phone: rawData.requester.phoneNumber,
      location: null // El solicitante inicial a veces no tiene coords en tiempo real en este objeto
    };
  }
  
  // 2. Normalizar OFICIAL
  if (rawData.officer) {
    officer = {
      name: rawData.officer.name || `${rawData.officer.firstName || ''} ${rawData.officer.lastName || ''}`.trim() || 'Oficial',
      location: rawData.officer.location || rawData.officer.coords,
      unit: rawData.officer.unit
    };
  } else if (rawData.assignedOfficer) {
    officer = {
      name: `${rawData.assignedOfficer.firstName || ''} ${rawData.assignedOfficer.lastName || ''}`.trim(),
      location: rawData.assignedOfficer.location || rawData.assignedOfficer.coords,
    };
  } else if (rawData.assignees && rawData.assignees.length > 0) {
    // Tomar el último asignado
    const last = rawData.assignees[rawData.assignees.length - 1];
    if (last.officerId) {
      officer = {
        name: `${last.officerId.firstName || ''} ${last.officerId.lastName || ''}`.trim(),
        location: last.officerId.location || last.officerId.coords,
      };
    }
  }

  // Distancia
  const distance = rawData.dist || rawData.distance || null;

  return {
    civil: civil || { name: 'Civil Desconocido' },
    officer: officer,
    distance,
    rawData
  };
};

export const useIncidentTracking = (incidentId, enabled = true) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchTracking = async () => {
    if (!incidentId || !enabled) return;

    try {
      if (!trackingData) setLoading(true); // Solo loading en la primera carga
      const rawData = await incidentsService.getIncidentTracking(incidentId);
      const normalized = normalizeTrackingData(rawData);
      
      setTrackingData(normalized);
      setLastUpdate(new Date());
      setError('');
    } catch (err) {
      console.error('Error fetching tracking:', err);
      setError('Error obteniendo datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!incidentId || !enabled) return;

    fetchTracking();
    intervalRef.current = setInterval(fetchTracking, 4000); // Actualizar cada 4s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [incidentId, enabled]);

  const forceRefresh = () => fetchTracking();

  return { trackingData, loading, error, lastUpdate, forceRefresh };
};