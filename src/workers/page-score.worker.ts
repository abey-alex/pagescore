import { 
  AnyPageScoreEvent, 
  DEFAULT_WEIGHTS, 
  EventCategory, 
  PageScoreHistoryEntry,
  Severity
} from '../types/pageScore';

let score = 100;
const history: PageScoreHistoryEntry[] = [];

// Function to calculate weight based on event type and severity
const calculateWeight = (event: AnyPageScoreEvent): number => {
  switch (event.category) {
    case EventCategory.PERFORMANCE:
      return DEFAULT_WEIGHTS[EventCategory.PERFORMANCE].default;
    
    case EventCategory.ANTI_PATTERN:
      return DEFAULT_WEIGHTS[EventCategory.ANTI_PATTERN][event.severity].default;
    
    case EventCategory.OWNERSHIP:
      return DEFAULT_WEIGHTS[EventCategory.OWNERSHIP].default;
    
    case EventCategory.TREND:
      return DEFAULT_WEIGHTS[EventCategory.TREND].default;
    
    case EventCategory.ACCESSIBILITY:
      return DEFAULT_WEIGHTS[EventCategory.ACCESSIBILITY].default;
    
    default:
      return 0;
  }
};

// Function to add event to history
const addToHistory = (event: AnyPageScoreEvent) => {
  const previousScore = score;
  const weight = calculateWeight(event);
  score = Math.max(0, Math.min(100, score - weight));
  
  history.push({
    timestamp: Date.now(),
    event,
    score,
    previousScore
  });
};

// Define the type for our worker messages
type WorkerMessage = {
  type: 'ADD_EVENT' | 'GET_SCORE' | 'GET_HISTORY';
  event?: AnyPageScoreEvent;
};

type WorkerResponse = {
  type: 'SCORE_UPDATED' | 'HISTORY_UPDATED';
  score?: number;
  history?: PageScoreHistoryEntry[];
};

// Use the global scope for the worker
declare const global: WorkerGlobalScope & typeof globalThis;

global.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  switch (event.data.type) {
    case 'ADD_EVENT':
      if (event.data.event) {
        addToHistory(event.data.event);
        global.postMessage({ 
          type: 'SCORE_UPDATED', 
          score,
          history 
        } as WorkerResponse);
      }
      break;
    
    case 'GET_SCORE':
      global.postMessage({ 
        type: 'SCORE_UPDATED', 
        score,
        history 
      } as WorkerResponse);
      break;
    
    case 'GET_HISTORY':
      global.postMessage({ 
        type: 'HISTORY_UPDATED', 
        history 
      } as WorkerResponse);
      break;
    
    default:
      break;
  }
});

// Make the file a module
export {}; 