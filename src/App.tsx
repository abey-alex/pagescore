import React, { useEffect, useState } from 'react';
import Counter from './components/Counter';
import PageScore from './components/PageScore';

const App: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const pageScoreWorker = new Worker(new URL('./workers/page-score.worker.ts', import.meta.url));
    setWorker(pageScoreWorker);

    return () => {
      pageScoreWorker.terminate();
    };
  }, []);

  if (!worker) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0'
      }}>
        <Counter worker={worker} />
      </div>
      <PageScore worker={worker} />
    </>
  );
};

export default App; 