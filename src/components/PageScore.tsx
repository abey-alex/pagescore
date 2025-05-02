import React, { useEffect, useState } from 'react';
import HistoryModal from './HistoryModal';
import { PageScoreHistoryEntry } from '../types/pageScore';

interface PageScoreProps {
  worker: Worker;
}

const PageScore: React.FC<PageScoreProps> = ({ worker }) => {
  const [score, setScore] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<PageScoreHistoryEntry[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SCORE_UPDATED' || event.data.type === 'HISTORY_UPDATED') {
        if (event.data.history) {
          setHistory(event.data.history);
        }
        if (event.data.score !== undefined) {
          setScore(event.data.score);
        }
      }
    };

    worker.addEventListener('message', handleMessage);
    // Get initial score and history
    worker.postMessage({ type: 'GET_SCORE' });

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [worker]);

  const getScoreColor = (score: number) => {
    if (score <= 40) return '#ff4444'; // Red
    if (score <= 80) return '#ffd700'; // Yellow
    return '#44ff44'; // Green
  };

  const clampedScore = Math.min(Math.max(score, 0), 100);
  const color = getScoreColor(clampedScore);

  return (
    <>
      <div 
        onClick={() => {
          setIsModalOpen(true);
          // Refresh history when opening modal
          worker.postMessage({ type: 'GET_HISTORY' });
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer'
        }}
      >
        <span style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {clampedScore}
        </span>
      </div>
      <HistoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        history={history}
      />
    </>
  );
};

export default PageScore; 