// src/pages/OperatorDashboard/OperatorDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { incidentsService } from '../../services/incidents';
import IncidentTable from '../../components/incidents/IncidentTable';
import './OperatorDashboard.css';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'OPEN', label: 'Abiertos' },
  { value: 'ASSIGNED', label: 'Asignados' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'RESOLVED', label: 'Resueltos' },
  { value: 'CANCELLED', label: 'Cancelados' }
];

// Tipos de emergencia EXACTAMENTE como están en tu backend
const EMERGENCY_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'ROBO', label: 'Robo / Asalto' },
  { value: 'VIOLENCIA', label: 'Violencia / Agresión' },
  { value: 'ACCIDENTE', label: 'Accidente de tránsito' },
  { value: 'INCENDIO', label: 'Incendio' },
  { value: 'SALUD', label: 'Emergencia médica' },
  { value: 'PERSONA_SOSPECHOSA', label: 'Persona sospechosa' },
  { value: 'OTRO', label: 'Otro' }
];

export default function OperatorDashboard() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filtrar y ordenar incidentes
  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = [...incidents];

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    // Filtro por tipo de emergencia
    if (typeFilter) {
      filtered = filtered.filter(incident => incident.emergencyTypeCode === typeFilter);
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.createdAt).toISOString().split('T')[0];
        return incidentDate === dateFilter;
      });
    }

    // Ordenar del más reciente al más antiguo
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [incidents, statusFilter, typeFilter, dateFilter]);

  useEffect(() => {
    loadIncidents();
  }, [statusFilter]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const incidentsData = await incidentsService.getIncidents(params);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Error cargando incidentes:', error);
      alert('Error al cargar los incidentes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadIncidents();
  };

  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setDateFilter('');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = statusFilter || typeFilter || dateFilter;

  return (
    <div className="operator-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Operador</h1>
        <p>Bienvenido/a, {user.firstName} {user.lastName}</p>
      </div>
      
      <div className="dashboard-controls">
        <div className="filters-container">
          <h3>Filtrar Incidentes</h3>
          
          <div className="filters-row">
            {/* Filtro por Estado */}
            <div className="filter-group">
              <label htmlFor="status-filter">Estado:</label>
              <select 
                id="status-filter"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {STATUS_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Tipo de Emergencia */}
            <div className="filter-group">
              <label htmlFor="type-filter">Tipo de Emergencia:</label>
              <select 
                id="type-filter"
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                {EMERGENCY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Fecha */}
            <div className="filter-group">
              <label htmlFor="date-filter">Fecha específica:</label>
              <input 
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Botón Limpiar Filtros */}
            {hasActiveFilters && (
              <div className="filter-group">
                <button 
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="results-info">
            Mostrando {filteredAndSortedIncidents.length} de {incidents.length} incidentes
            {hasActiveFilters && ' (filtrados)'}
          </div>
        </div>
        
        <button onClick={handleRefresh} className="refresh-btn">
          Actualizar Lista
        </button>
      </div>

      <div className="incidents-section">
        <h2>Incidentes {filteredAndSortedIncidents.length > 0 ? `(${filteredAndSortedIncidents.length})` : ''}</h2>
        <IncidentTable incidents={filteredAndSortedIncidents} loading={loading} />
      </div>
    </div>
  );
}