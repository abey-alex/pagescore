import React from 'react';
import { PageScoreHistoryEntry, EventCategory } from '../types/pageScore';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PageScoreHistoryEntry[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderEventDetails = (event: PageScoreHistoryEntry['event']) => {
    switch (event.category) {
      case EventCategory.PERFORMANCE:
        return (
          <div>
            <p>Load Time: {event.metrics.loadTime}ms</p>
            <p>Threshold: {event.metrics.threshold}ms</p>
          </div>
        );
      case EventCategory.ANTI_PATTERN:
        return (
          <div>
            <p>Type: {event.patternType}</p>
            <p>Location: {event.location}</p>
          </div>
        );
      case EventCategory.OWNERSHIP:
        return (
          <div>
            <p>Route: {event.route}</p>
            <p>Missing Owners: {event.missingOwners.join(', ')}</p>
          </div>
        );
      case EventCategory.TREND:
        return (
          <div>
            <p>Metric: {event.metric}</p>
            <p>Change: {event.percentageChange}%</p>
          </div>
        );
      case EventCategory.ACCESSIBILITY:
        return (
          <div>
            <p>Issue: {event.issueType}</p>
            <p>Element: {event.element}</p>
            <p>Impact: {event.impact}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Page Score History</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #ddd'
            }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Timestamp</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Severity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Weight</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((entry, index) => (
              <tr key={index} style={{
                borderBottom: '1px solid #ddd',
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
              }}>
                <td style={{ padding: '12px' }}>{formatTimestamp(entry.timestamp)}</td>
                <td style={{ padding: '12px' }}>{entry.event.category}</td>
                <td style={{ padding: '12px' }}>{entry.event.severity}</td>
                <td style={{ padding: '12px' }}>{entry.event.description}</td>
                <td style={{ padding: '12px' }}>{entry.event.weight}</td>
                <td style={{ padding: '12px' }}>{entry.score}</td>
                <td style={{ padding: '12px' }}>{renderEventDetails(entry.event)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryModal; 