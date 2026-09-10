import React from 'react';

// Premium color tokens matching an executive layout design system
const aqiLevels = {
  1: { text: 'Good', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  2: { text: 'Fair', color: '#84cc16', bg: '#f7fee7', border: '#d9f99d' },
  3: { text: 'Moderate', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  4: { text: 'Poor', color: '#f97316', bg: '#fff7ed', border: '#ffedd5' },
  5: { text: 'Very Poor', color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
};

const AQIDisplay = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="panel-premium-box">
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-6 w-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-400 animate-pulse">Parsing local sensor packets...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.list || data.list.length === 0) {
    return (
      <div className="panel-premium-box" style={{ background: 'linear-gradient(135deg, #ffffff, #f8fafc)', borderStyle: 'dashed' }}>
        <div className="text-center py-16 px-6">
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🎯</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569', margin: 0 }}>No Telemetry Selected</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0', lineHeight: '1.4' }}>
            Click anywhere on the map workspace to check the real-time Air Quality Index parameters.
          </p>
        </div>
      </div>
    );
  }

  const aqiData = data.list[0];
  const aqiValue = aqiData.main.aqi;
  const level = aqiLevels[aqiValue] || { text: 'Unknown', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' };
  const components = aqiData.components;

  return (
    <div className="panel-premium-box">
      
      {/* Dynamic Header Section matching current pollution level */}
      <div className="panel-header-section" style={{ borderBottomColor: '#f1f5f9' }}>
        <h2>Current Atmospheric Index</h2>
        <p>Real-time gas density and particle distribution analysis.</p>
      </div>

      <div className="panel-body-padding" style={{ padding: '1.25rem' }}>
        
        {/* Modern Air Index Status Banner */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem', 
            padding: '1.25rem', 
            borderRadius: '1rem', 
            backgroundColor: level.bg,
            border: `1px solid ${level.border}`,
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '3rem', fontWeight: 900, color: level.color, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {aqiValue}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: level.color, letterSpacing: '-0.02em' }}>
              {level.text}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '0.15rem' }}>
              Air Quality Index (AQI)
            </span>
          </div>
        </div>

        {/* Pollutants Breakdown Parameter List */}
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', uppercase: 'true', letterSpacing: '0.05em', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
            Main Pollutants (μg/m³)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(components).map(([key, value]) => (
              <div 
                key={key} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'between', 
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f5f9'
                }}
              >
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569', letterSpacing: '0.02em' }}>
                  {key.replace('_', '.').toUpperCase()}
                </span>
                <strong style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginLeft: 'auto' }}>
                  {value.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AQIDisplay;
