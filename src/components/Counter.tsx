import React from 'react';
import { 
  AnyPageScoreEvent, 
  EventCategory, 
  Severity 
} from '../types/pageScore';

interface CounterProps {
  worker: Worker;
}

const Counter: React.FC<CounterProps> = ({ worker }) => {
  const createPerformanceEvent = (): AnyPageScoreEvent => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    category: EventCategory.PERFORMANCE,
    severity: Severity.HIGH,
    description: 'Page load time exceeded threshold',
    weight: 15,
    metrics: {
      loadTime: 5000,
      threshold: 3000,
      actualValue: 5000
    }
  });

  const createAntiPatternEvent = (): AnyPageScoreEvent => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    category: EventCategory.ANTI_PATTERN,
    severity: Severity.CRITICAL,
    description: 'Critical anti-pattern detected',
    weight: 40,
    patternType: 'Memory Leak',
    location: 'Component X'
  });

  const createOwnershipEvent = (): AnyPageScoreEvent => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    category: EventCategory.OWNERSHIP,
    severity: Severity.MEDIUM,
    description: 'Route ownership missing',
    weight: 5,
    route: '/dashboard',
    missingOwners: ['team-a', 'team-b']
  });

  const createTrendEvent = (): AnyPageScoreEvent => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    category: EventCategory.TREND,
    severity: Severity.HIGH,
    description: 'Significant P99 trend increase',
    weight: 15,
    metric: 'API Response Time',
    previousValue: 200,
    currentValue: 300,
    percentageChange: 50
  });

  const createAccessibilityEvent = (): AnyPageScoreEvent => ({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    category: EventCategory.ACCESSIBILITY,
    severity: Severity.MEDIUM,
    description: 'Accessibility issue detected',
    weight: 10,
    issueType: 'Missing Alt Text',
    element: 'img#banner',
    impact: 'Screen readers cannot describe the image'
  });

  const handleEvent = (event: AnyPageScoreEvent) => {
    worker.postMessage({ type: 'ADD_EVENT', payload: { event } });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px'
    }}>
      <button 
        onClick={() => handleEvent(createPerformanceEvent())}
        style={{
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Performance Event
      </button>
      <button 
        onClick={() => handleEvent(createAntiPatternEvent())}
        style={{
          padding: '10px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Anti-Pattern Event
      </button>
      <button 
        onClick={() => handleEvent(createOwnershipEvent())}
        style={{
          padding: '10px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Ownership Event
      </button>
      <button 
        onClick={() => handleEvent(createTrendEvent())}
        style={{
          padding: '10px',
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Trend Event
      </button>
      <button 
        onClick={() => handleEvent(createAccessibilityEvent())}
        style={{
          padding: '10px',
          backgroundColor: '#9C27B0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Accessibility Event
      </button>
    </div>
  );
};

export default Counter; 