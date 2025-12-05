// src/services/officers.js
import api from './api';

export const officersService = {
  // Obtener oficiales cercanos
  async getNearbyOfficers(lon, lat, radius = 3000, limit = 10) {
    const response = await api.get('/nearby', {
      params: { lon, lat, radius, limit }
    });
    return response.data;
  },

  // Actualizar ubicación del oficial (para cuando implementemos OFFICER)
  async updateMyLocation(locationData) {
    const response = await api.put('/locations/me', locationData);
    return response.data;
  }
};