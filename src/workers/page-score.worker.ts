import { PageScoreHistoryEntry, EventCategory, Severity, AnyPageScoreEvent } from '../types/pageScore';

// Declare the global scope for the worker
declare const global: WorkerGlobalScope & typeof globalThis;

let score = 100;
let history: PageScoreHistoryEntry[] = [];

const addToHistory = (event: Omit<PageScoreHistoryEntry, 'timestamp'>) => {
  const historyEntry: PageScoreHistoryEntry = {
    ...event,
    timestamp: Date.now()
  };
  history.push(historyEntry);
  return historyEntry;
};

const updateScore = (weight: number) => {
  const previousScore = score;
  score = Math.max(0, Math.min(100, score - weight));
  return { score, previousScore };
};

const createPerformanceEvent = (description: string, weight: number): AnyPageScoreEvent => ({
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  category: EventCategory.PERFORMANCE,
  severity: Severity.LOW,
  description,
  weight,
  metrics: {
    loadTime: 0,
    threshold: 0,
    actualValue: 0
  }
});

const handleMessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'INCREMENT':
      const { score: newScore, previousScore } = updateScore(-1);
      const incrementEvent = addToHistory({
        event: createPerformanceEvent('Score incremented', -1),
        score: newScore,
        previousScore
      });
      global.postMessage({ type: 'SCORE_UPDATED', payload: { score: newScore, history } });
      break;

    case 'DECREMENT':
      const { score: newScore2, previousScore: previousScore2 } = updateScore(1);
      const decrementEvent = addToHistory({
        event: createPerformanceEvent('Score decremented', 1),
        score: newScore2,
        previousScore: previousScore2
      });
      global.postMessage({ type: 'SCORE_UPDATED', payload: { score: newScore2, history } });
      break;

    case 'GET_SCORE':
      global.postMessage({ type: 'SCORE_UPDATED', payload: { score, history } });
      break;

    case 'GET_HISTORY':
      global.postMessage({ type: 'HISTORY_UPDATED', payload: { history } });
      break;

    case 'ADD_EVENT':
      if (payload?.event) {
        const { score: newScore3, previousScore: previousScore3 } = updateScore(payload.event.weight);
        const event = addToHistory({
          event: payload.event,
          score: newScore3,
          previousScore: previousScore3
        });
        global.postMessage({ type: 'SCORE_UPDATED', payload: { score: newScore3, history } });
      }
      break;
  }
};

global.onmessage = handleMessage;

// Make the file a module
export {}; 