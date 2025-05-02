import React, { useState, useEffect, useRef } from 'react';
import { AccessibilityEvent, EventCategory, Severity } from '../types/pageScore';
import * as axe from 'axe-core';
import { Result, Results } from 'axe-core';

interface PageScoreProps {
  worker: Worker;
  onScoreClick: () => void;
}

const PageScore: React.FC<PageScoreProps> = ({ worker, onScoreClick }) => {
  const [score, setScore] = useState<number>(100);
  const [accessibilityWorker, setAccessibilityWorker] = useState<Worker | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const reportedViolations = useRef<Set<string>>(new Set());
  const checkTimeoutRef = useRef<number | null>(null);

  // Initialize axe-core
  useEffect(() => {
    try {
      (axe as any).configure({
        branding: {
          brand: 'PageScore',
          application: 'web'
        },
        reporter: 'v2',
        checks: [
          { id: 'color-contrast', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'document-title', enabled: true },
          { id: 'html-has-lang', enabled: true },
          { id: 'input-image-alt', enabled: true },
          { id: 'label', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'page-has-heading-one', enabled: true },
          { id: 'select-name', enabled: true }
        ],
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'document-title', enabled: true },
          { id: 'html-has-lang', enabled: true },
          { id: 'input-image-alt', enabled: true },
          { id: 'label', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'page-has-heading-one', enabled: true },
          { id: 'select-name', enabled: true }
        ]
      });
    } catch (error) {
      console.error('Failed to initialize axe-core:', error);
    }
  }, []);

  useEffect(() => {
    if (!worker) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'SCORE_UPDATED') {
        setScore(payload.score);
      }
    };

    worker.addEventListener('message', handleMessage);
    return () => worker.removeEventListener('message', handleMessage);
  }, [worker]);

  // Initialize accessibility worker
  useEffect(() => {
    if (!worker) return;

    const a11yWorker = new Worker(new URL('../workers/accessibility-checker.worker.ts', import.meta.url));
    setAccessibilityWorker(a11yWorker);

    const handleAccessibilityViolations = (event: MessageEvent) => {
      if (event.data.type === 'ACCESSIBILITY_VIOLATIONS') {
        const violations = event.data.violations as AccessibilityEvent[];
        violations.forEach(violation => {
          worker.postMessage({ type: 'ADD_EVENT', payload: { events: [violation] } });
        });
      }
    };

    a11yWorker.addEventListener('message', handleAccessibilityViolations);
    a11yWorker.postMessage({ type: 'START_CHECKING' });

    // Run initial accessibility check after worker is ready
    checkAccessibility();

    return () => {
      a11yWorker.postMessage({ type: 'STOP_CHECKING' });
      a11yWorker.removeEventListener('message', handleAccessibilityViolations);
      a11yWorker.terminate();
    };
  }, [worker]);

  const checkAccessibility = async () => {
    if (checkTimeoutRef.current) {
      window.clearTimeout(checkTimeoutRef.current);
    }

    checkTimeoutRef.current = window.setTimeout(async () => {
      try {
        const results = await (axe as any).run() as Results;
        
        if (results.violations.length === 0) {
          const noIssuesEvent: AccessibilityEvent = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            category: EventCategory.ACCESSIBILITY,
            severity: Severity.LOW,
            description: 'No accessibility issues found',
            weight: 0,
            issueType: 'no_issues',
            element: 'page',
            impact: 'none'
          };
          worker.postMessage({ type: 'ADD_EVENT', payload: { events: [noIssuesEvent] } });
          return;
        }

        const newViolations = results.violations.filter((violation: Result) => {
          const violationKey = `${violation.id}-${violation.nodes[0]?.html}`;
          if (reportedViolations.current.has(violationKey)) {
            return false;
          }
          reportedViolations.current.add(violationKey);
          return true;
        });

        if (newViolations.length > 0) {
          const events: AccessibilityEvent[] = newViolations.map(violation => {
            // Calculate weight based on impact and number of violations
            const baseWeight = violation.impact === 'critical' ? 5 :
                             violation.impact === 'serious' ? 3 :
                             violation.impact === 'moderate' ? 2 : 1;
            
            // Additional weight for multiple violations
            const multiplier = Math.min(3, newViolations.length); // Cap at 3x
            const finalWeight = baseWeight * multiplier;

            return {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              category: EventCategory.ACCESSIBILITY,
              severity: violation.impact === 'critical' || violation.impact === 'serious' ? Severity.HIGH : 
                       violation.impact === 'moderate' ? Severity.MEDIUM : Severity.LOW,
              description: `${violation.help} (${violation.impact} impact)`,
              weight: finalWeight,
              issueType: violation.id,
              element: violation.nodes[0]?.html || 'Unknown element',
              impact: violation.impact
            };
          });

          worker.postMessage({ type: 'ADD_EVENT', payload: { events } });
        }
      } catch (error) {
        console.error('Accessibility analysis failed:', error);
      }
    }, 500); // Debounce checks by 500ms
  };

  // Set up mutation observer
  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      checkAccessibility();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (checkTimeoutRef.current) {
        window.clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  const getScoreColor = (score: number): string => {
    if (score <= 40) return '#f44336'; // Red
    if (score <= 80) return '#ffc107'; // Yellow
    return '#4caf50'; // Green
  };

  return (
    <div
      onClick={onScoreClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: getScoreColor(score),
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
        zIndex: 1000
      }}
    >
      {score}
    </div>
  );
};

export default PageScore; 