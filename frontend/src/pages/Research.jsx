import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, BookOpen, Quote, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';
import api from '../services/api';

const Research = () => {
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [expandedPaperId, setExpandedPaperId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/research' }).catch(() => {});
    
    const fetchResearch = async () => {
      try {
        const response = await api.get('research/');
        setPapers(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching research:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, []);

  const handleCopyCitation = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedPaperId(prev => (prev === id ? null : id));
  };

  // Extract unique types and years for filter dropdowns
  const researchTypes = ['all', ...new Set(papers.map(p => p.research_type))];
  const publicationYears = ['all', ...new Set(papers.map(p => new Date(p.publication_date).getFullYear().toString()))].sort((a,b) => b-a);

  const filteredPapers = papers.filter(paper => {
    const paperYear = new Date(paper.publication_date).getFullYear().toString();
    const matchesType = selectedType === 'all' || paper.research_type.toLowerCase() === selectedType.toLowerCase();
    const matchesYear = selectedYear === 'all' || paperYear === selectedYear;
    
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.findings && paper.findings.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesYear && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Publications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Research Hub</span>
          <h1 className="text-4xl font-display font-extrabold text-white mt-2">
            Academic Research & Computational Science
          </h1>
          <p className="text-lg text-blue-105 mt-4 leading-relaxed max-w-3xl">
            Peer-reviewed articles, journal entries, and white papers exploring database latency limits, secure consensus models, and multi-node clusters.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Filter and Search Bar */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-800/60 shadow-sm">
          {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search titles, abstracts, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all capitalize"
          >
            <option value="all">All Types</option>
            {researchTypes.filter(t => t !== 'all').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="all">All Years</option>
            {publicationYears.filter(y => y !== 'all').map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Publications Listing */}
      <section className="space-y-6">
        {filteredPapers.map((paper) => {
          const isExpanded = expandedPaperId === paper.id;
          return (
            <div
              key={paper.id}
              className="bg-white dark:bg-dark-900/40 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 hover:shadow-md transition-all overflow-hidden text-left"
            >
              {/* Main row */}
              <div
                onClick={() => toggleExpand(paper.id)}
                className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-dark-900/20 transition-all"
              >
                <div className="space-y-3 flex-grow max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-55 dark:bg-primary-950/30 text-[11px] font-bold text-primary-600 dark:text-primary-400 capitalize">
                      {paper.research_type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Published: {paper.publication_date}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors leading-snug">
                    {paper.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {paper.keywords?.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-850 text-xs font-semibold text-slate-500 dark:text-slate-450">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="text-sm font-semibold text-primary-500 flex items-center gap-1">
                    {isExpanded ? "Hide Abstract" : "View Abstract"}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </div>

              {/* Collapsible content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-slate-150 dark:border-dark-800 bg-slate-50/50 dark:bg-dark-900/10 overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 space-y-6 text-sm leading-relaxed">
                      {/* Abstract */}
                      <div className="space-y-2">
                        <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base">Abstract</h4>
                        <p className="text-slate-650 dark:text-slate-300">
                          {paper.abstract}
                        </p>
                      </div>

                      {/* Methodology and Findings Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {paper.methodology && (
                          <div className="space-y-2">
                            <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base">Methodology</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-xs">
                              {paper.methodology}
                            </p>
                          </div>
                        )}
                        {paper.findings && (
                          <div className="space-y-2">
                            <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base">Key Findings</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-xs">
                              {paper.findings}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Download and Citation Footer */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-6 border-t border-slate-200/50 dark:border-dark-800/50">
                        {paper.citation ? (
                          <div className="flex items-start gap-2 max-w-xl bg-slate-100/50 dark:bg-dark-950/50 p-3.5 rounded-xl border border-slate-200/50 dark:border-dark-850">
                            <Quote size={18} className="text-primary-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs text-slate-500 dark:text-slate-450 italic pr-8">
                                &ldquo;{paper.citation}&rdquo;
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopyCitation(paper.citation, paper.id)}
                              className="ml-auto p-1.5 rounded bg-white dark:bg-dark-900 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200/40"
                              title="Copy Citation"
                            >
                              {copiedId === paper.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        ) : (
                          <div></div>
                        )}

                        {paper.pdf && (
                          <a
                            href={paper.pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
                          >
                            <Download size={14} /> Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {filteredPapers.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <Info className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No publications matches your filtering criteria.</p>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default Research;
