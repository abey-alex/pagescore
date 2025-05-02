// Event categories
export enum EventCategory {
  PERFORMANCE = 'PERFORMANCE',
  ANTI_PATTERN = 'ANTI_PATTERN',
  OWNERSHIP = 'OWNERSHIP',
  TREND = 'TREND',
  ACCESSIBILITY = 'ACCESSIBILITY'
}

// Event severity levels
export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// Base event interface
export interface PageScoreEvent {
  id: string;
  timestamp: number;
  category: EventCategory;
  severity: Severity;
  description: string;
  weight: number;
}

// Specific event types
export interface PerformanceEvent extends PageScoreEvent {
  category: EventCategory.PERFORMANCE;
  metrics: {
    loadTime: number;
    threshold: number;
    actualValue: number;
  };
}

export interface AntiPatternEvent extends PageScoreEvent {
  category: EventCategory.ANTI_PATTERN;
  patternType: string;
  location: string;
}

export interface OwnershipEvent extends PageScoreEvent {
  category: EventCategory.OWNERSHIP;
  route: string;
  missingOwners: string[];
}

export interface TrendEvent extends PageScoreEvent {
  category: EventCategory.TREND;
  metric: string;
  previousValue: number;
  currentValue: number;
  percentageChange: number;
}

export interface AccessibilityEvent extends PageScoreEvent {
  category: EventCategory.ACCESSIBILITY;
  issueType: string;
  element: string;
  impact: string;
}

// Union type for all possible events
export type AnyPageScoreEvent = 
  | PerformanceEvent 
  | AntiPatternEvent 
  | OwnershipEvent 
  | TrendEvent 
  | AccessibilityEvent;

// Weight configuration interface
export interface WeightConfig {
  min: number;
  max: number;
  default: number;
}

// Category weight configurations
export interface CategoryWeights {
  [EventCategory.PERFORMANCE]: WeightConfig;
  [EventCategory.ANTI_PATTERN]: {
    [Severity.CRITICAL]: WeightConfig;
    [Severity.HIGH]: WeightConfig;
    [Severity.MEDIUM]: WeightConfig;
    [Severity.LOW]: WeightConfig;
  };
  [EventCategory.OWNERSHIP]: WeightConfig;
  [EventCategory.TREND]: WeightConfig;
  [EventCategory.ACCESSIBILITY]: WeightConfig;
}

// Default weight configurations
export const DEFAULT_WEIGHTS: CategoryWeights = {
  [EventCategory.PERFORMANCE]: {
    min: 10,
    max: 20,
    default: 15
  },
  [EventCategory.ANTI_PATTERN]: {
    [Severity.CRITICAL]: { min: 25, max: 50, default: 40 },
    [Severity.HIGH]: { min: 15, max: 25, default: 20 },
    [Severity.MEDIUM]: { min: 10, max: 15, default: 12 },
    [Severity.LOW]: { min: 5, max: 10, default: 7 }
  },
  [EventCategory.OWNERSHIP]: {
    min: 5,
    max: 5,
    default: 5
  },
  [EventCategory.TREND]: {
    min: 10,
    max: 20,
    default: 15
  },
  [EventCategory.ACCESSIBILITY]: {
    min: 5,
    max: 15,
    default: 10
  }
};

// History entry interface
export interface PageScoreHistoryEntry {
  timestamp: number;
  event: AnyPageScoreEvent;
  score: number;
  previousScore: number;
} 