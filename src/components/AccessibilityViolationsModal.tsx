import React from 'react';

interface AccessibilityViolationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityViolationsModal: React.FC<AccessibilityViolationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Accessibility Violation 1: Missing heading hierarchy */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Accessibility Violations</h3>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        {/* Accessibility Violation 2: Low contrast text */}
        <div style={{ color: '#999999', marginBottom: '10px' }}>
          This modal contains several accessibility violations that will be detected by axe-core
        </div>

        {/* Accessibility Violation 3: Missing table caption */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #ddd'
            }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Violation Type</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>Missing Heading Hierarchy</td>
              <td style={{ padding: '12px' }}>Using h3 instead of h2 for main heading</td>
              <td style={{ padding: '12px' }}>Moderate</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>Low Contrast Text</td>
              <td style={{ padding: '12px' }}>Text color #999999 on white background</td>
              <td style={{ padding: '12px' }}>Serious</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>Missing Table Caption</td>
              <td style={{ padding: '12px' }}>Table has no caption for screen readers</td>
              <td style={{ padding: '12px' }}>Moderate</td>
            </tr>
          </tbody>
        </table>

        {/* Accessibility Violation 4: Image without alt text */}
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjwvc3ZnPg==" 
          style={{ marginTop: '20px', width: '100%' }}
        />

        {/* Accessibility Violation 5: Form without labels */}
        <div style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="Search violations..." 
            style={{ 
              padding: '8px',
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Accessibility Violation 6: Button without aria-label */}
        <button
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export Report
        </button>
      </div>
    </div>
  );
};

export default AccessibilityViolationsModal; 