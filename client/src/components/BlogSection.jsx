import React from 'react';

const articles = [
  {
    id: 1,
    title: 'Understanding PM2.5: How Fine Particles Impact Community Health',
    category: 'Education',
    date: 'Sep 10, 2026',
    excerpt: 'Fine particulate matter can easily penetrate deep into lungs. Learn how to read tracking data indexes to safeguard your family during heavy smog waves.',
    readTime: '4 min read'
  },
  {
    id: 2,
    title: 'Ruiru Bypass Air Quality: Monitoring Localized Pollution Spikes',
    category: 'Local Updates',
    date: 'Sep 8, 2026',
    excerpt: 'Our community sensor grid recently flagged brief traffic emission spikes near major highway junctions. Read our full optimization report.',
    readTime: '5 min read'
  },
  {
    id: 3,
    title: '5 Practical Steps to Reduce Your Local Carbon Footprint Today',
    category: 'Action Plan',
    date: 'Sep 5, 2026',
    excerpt: 'From optimizing home energy consumption nodes to supporting crowdsourced environmental tools, discovery small changes that drive structural impacts.',
    readTime: '3 min read'
  }
];

const BlogSection = () => {
  return (
    <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Latest Environmental News & Insights
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Stay updated with localized air analytics reports, atmospheric health tips, and climate change insights.
        </p>
      </div>

      {/* Responsive Flexbox/Grid Matrix wrapper */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="panel-premium-box" 
            style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
          >
            <div className="panel-header-section" style={{ padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: '9999px', border: '1px solid #dbeafe' }}>
                {article.category}
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginTop: '0.75rem', marginBottom: 0, lineHeight: '1.35' }}>
                {article.title}
              </h3>
            </div>
            
            <div className="panel-body-padding" style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                {article.excerpt}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{article.date}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
