import React, { useEffect, useState } from 'react';

interface PageScoreProps {
  worker: Worker;
  onScoreClick: () => void;
}

const PageScore: React.FC<PageScoreProps> = ({ worker, onScoreClick }) => {
  const [score, setScore] = useState<number>(100);

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      const { type, payload } = event.data;
      if (type === 'SCORE_UPDATED') {
        setScore(payload.score);
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'GET_SCORE' });

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [worker]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: getScoreColor(score),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
        onClick={onScoreClick}
        role="button"
        aria-label={`Page score: ${score}. Click to view history.`}
      >
        <span
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export default PageScore; 