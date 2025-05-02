import { AccessibilityEvent, EventCategory, Severity } from '../types/pageScore';
import * as axe from 'axe-core';

// Declare the global scope for the worker
declare const global: WorkerGlobalScope & typeof globalThis;

let isChecking = false;

const createNoIssuesEvent = (): AccessibilityEvent => ({
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  category: EventCategory.ACCESSIBILITY,
  severity: Severity.LOW,
  description: 'No accessibility issues found',
  weight: 0,
  issueType: 'no_issues',
  element: 'page',
  impact: 'none'
});

const runAccessibilityCheck = async () => {
  try {
    const results = await (axe as any).run();
    
    if (results.violations.length === 0) {
      global.postMessage({ type: 'ACCESSIBILITY_VIOLATIONS', violations: [createNoIssuesEvent()] });
      return;
    }

    const events: AccessibilityEvent[] = results.violations.map((violation: any) => ({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      category: EventCategory.ACCESSIBILITY,
      severity: violation.impact === 'critical' || violation.impact === 'serious' ? Severity.HIGH : 
               violation.impact === 'moderate' ? Severity.MEDIUM : Severity.LOW,
      description: `${violation.help} (${violation.impact} impact)`,
      weight: violation.impact === 'critical' ? 5 :
             violation.impact === 'serious' ? 3 :
             violation.impact === 'moderate' ? 2 : 1,
      issueType: violation.id,
      element: violation.nodes[0]?.html || 'Unknown element',
      impact: violation.impact
    }));

    global.postMessage({ type: 'ACCESSIBILITY_VIOLATIONS', violations: events });
  } catch (error) {
    console.error('Accessibility check failed:', error);
  }
};

global.onmessage = (event: MessageEvent) => {
  const { type } = event.data;

  switch (type) {
    case 'START_CHECKING':
      isChecking = true;
      // Run initial check immediately
      runAccessibilityCheck();
      break;

    case 'STOP_CHECKING':
      isChecking = false;
      break;
  }
};

// Make the file a module
export {}; 