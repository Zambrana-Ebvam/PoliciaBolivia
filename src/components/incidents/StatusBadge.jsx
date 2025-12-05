// src/components/incidents/StatusBadge.jsx
import './StatusBadge.css';

const statusConfig = {
  OPEN: { label: 'Abierto', className: 'status-open' },
  ASSIGNED: { label: 'Asignado', className: 'status-assigned' },
  IN_PROGRESS: { label: 'En Progreso', className: 'status-in-progress' },
  RESOLVED: { label: 'Resuelto', className: 'status-resolved' },
  CANCELLED: { label: 'Cancelado', className: 'status-cancelled' }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: 'status-unknown' };
  
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}