import React from 'react';

const articles = [
  {
    id: 1,
    title: 'Understanding PM2.5: How Fine Particles Impact Community Health',
    category: 'Education',
    date: 'Sep 10, 2026',
    excerpt: 'Fine particulate matter can easily penetrate deep into lungs. Learn how to read tracking data indexes to safeguard your family during heavy smog waves.',
    readTime: '4 min read',
    url: 'https://who.int'
  },
  {
    id: 2,
    title: 'Ruiru Bypass Air Quality: Monitoring Localized Pollution Spikes',
    category: 'Local Updates',
    date: 'Sep 8, 2026',
    excerpt: 'Our community sensor grid recently flagged brief traffic emission spikes near major highway junctions. Read our full optimization report.',
    readTime: '5 min read',
    url: 'https://unep.org'
  },
  {
    id: 3,
    title: '5 Practical Steps to Reduce Your Local Carbon Footprint Today',
    category: 'Action Plan',
    date: 'Sep 5, 2026',
    excerpt: 'From optimizing home energy consumption nodes to supporting crowdsourced environmental tools, discover small changes that drive structural impacts.',
    readTime: '3 min read',
    url: 'https://nasa.gov'
  }
];

const BlogSection = () => {
  return (
    <div className="mt-12 mb-12 px-4 md:px-0">
      <div className="border-t border-slate-200 pt-10 mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Latest Environmental News & Insights
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Stay updated with localized air analytics reports, atmospheric health tips, and climate change insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {articles.map((article) => (
          <a 
            key={article.id} 
            href={article.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="panel-premium-box m-0 flex flex-col justify-between h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer text-left block no-underline"
          >
            <div className="panel-header-section p-4 bg-slate-50/50 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block">
                {article.category}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-3 line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </div>
            
            <div className="p-5 flex-grow flex flex-col justify-between">
              <p className="text-sm text-slate-600 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">{article.date}</span>
                <span className="text-xs text-slate-500 font-semibold">{article.readTime}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
