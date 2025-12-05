import api from './api';

export const incidentsService = {
  // Obtener todos los incidentes
  async getIncidents(params = {}) {
    const response = await api.get('/incidents', { params });
    return response.data;
  },

  // Obtener un incidente específico
  async getIncidentById(id) {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  // Crear nuevo incidente
  async createIncident(incidentData) {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },

  // Asignar oficial
  async assignOfficer(incidentId, officerId) {
    const response = await api.post(`/incidents/${incidentId}/assign`, { officerId });
    return response.data;
  },

  // Resolver incidente
  async resolveIncident(incidentId) {
    const response = await api.post(`/incidents/${incidentId}/resolve`);
    return response.data;
  },

  // Cancelar incidente
  async cancelIncident(incidentId) {
    const response = await api.post(`/incidents/${incidentId}/cancel`);
    return response.data;
  },

  // Obtener tracking en tiempo real (Con logs para debug)
  async getIncidentTracking(incidentId) {
    // console.log('📡 Fetching tracking for:', incidentId);
    const response = await api.get(`/incidents/${incidentId}/tracking`);
    return response.data;
  }
};