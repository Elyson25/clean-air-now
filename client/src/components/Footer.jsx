import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1.5rem 2rem', marginTop: 'auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Meta Signature */}
        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Clean Air Now
          </span>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
            © {new Date().getFullYear()} Monitoring ecosystems, protecting urban air spheres.
          </p>
        </div>

        {/* Informative Link Placeholders */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>Sensors Registry</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>Community Guidelines</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
            API Live
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
