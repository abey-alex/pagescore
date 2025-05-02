import React from 'react';
import { PageScoreHistoryEntry, EventCategory } from '../types/pageScore';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PageScoreHistoryEntry[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const renderEventDetails = (event: PageScoreHistoryEntry['event']) => {
    switch (event.category) {
      case EventCategory.PERFORMANCE:
        return (
          <ul>
            <li>{event.metrics.loadTime}ms</li>
            <li>{event.metrics.threshold}ms</li>
            <li>{event.metrics.actualValue}ms</li>
          </ul>
        );
      case EventCategory.ANTI_PATTERN:
        return (
          <ul>
            <li>{event.patternType}</li>
            <li>{event.location}</li>
            <li>-</li>
          </ul>
        );
      case EventCategory.OWNERSHIP:
        return (
          <ul>
            <li>{event.route}</li>
            <li>{event.missingOwners.join(', ')}</li>
            <li>-</li>
          </ul>
        );
      case EventCategory.TREND:
        return (
          <ul>
            <li>{event.metric}</li>
            <li>{event.previousValue}</li>
            <li>{event.currentValue}</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '1000px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Page Score History</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Timestamp</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Severity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Weight</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Payload</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr 
                key={entry.timestamp}
                style={{ 
                  borderBottom: '1px solid #ddd', 
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' 
                }}
              >
                <td style={{ padding: '12px' }}>{new Date(entry.timestamp).toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{entry.event.category}</td>
                <td style={{ padding: '12px' }}>{entry.event.severity}</td>
                <td style={{ padding: '12px' }}>{entry.event.description}</td>
                <td style={{ padding: '12px' }}>{entry.event.weight}</td>
                <td style={{ padding: '12px' }}>{entry.score} (Previous: {entry.previousScore})</td>
                <td>{renderEventDetails(entry.event)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryModal; 