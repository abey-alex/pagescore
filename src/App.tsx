import React, { useEffect, useState } from 'react';
import Counter from './components/Counter';
import PageScore from './components/PageScore';
import HistoryModal from './components/HistoryModal';
import AccessibilityViolationsModal from './components/AccessibilityViolationsModal';
import { PageScoreHistoryEntry, EventCategory, Severity } from './types/pageScore';

const App: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [history, setHistory] = useState<PageScoreHistoryEntry[]>([]);

  useEffect(() => {
    const pageScoreWorker = new Worker(new URL('./workers/page-score.worker.ts', import.meta.url));
    setWorker(pageScoreWorker);

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'HISTORY_UPDATED') {
        setHistory(payload.history);
      } else if (type === 'SCORE_UPDATED') {
        setHistory(payload.history);
      }
    };

    pageScoreWorker.addEventListener('message', handleMessage);
    
    // Send initial page load event
    pageScoreWorker.postMessage({ 
      type: 'ADD_EVENT', 
      payload: { 
        event: {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          category: EventCategory.PERFORMANCE,
          severity: Severity.LOW,
          description: 'Page loaded',
          weight: 0,
          metrics: {
            loadTime: 0,
            threshold: 0,
            actualValue: 0
          }
        }
      }
    });

    return () => {
      pageScoreWorker.removeEventListener('message', handleMessage);
      pageScoreWorker.terminate();
    };
  }, []);

  if (!worker) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        style={{ 
          padding: '20px',
          textAlign: 'center'
        }}
      >
        Loading application...
      </div>
    );
  }

  return (
    <div 
      style={{ padding: '20px' }}
      role="main"
    >
      <h1>Page Score Demo</h1>
      <Counter worker={worker} />
      <PageScore worker={worker} onScoreClick={() => setIsHistoryModalOpen(true)} />
      <button
        onClick={() => setIsAccessibilityModalOpen(true)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
        aria-label="Open modal with accessibility problems"
      >
        Open modal with accessibility problems
      </button>

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />

      <AccessibilityViolationsModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />
    </div>
  );
};

export default App; 