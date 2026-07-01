import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Code, Award, Terminal, HardDrive, BarChart3, Info, Search, Cpu, BookOpen, Quote } from 'lucide-react';
import api from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/skills' }).catch(() => {});
    
    const fetchSkills = async () => {
      try {
        const response = await api.get('skills/');
        setSkills(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const tabs = [
    { id: 'All', name: 'All Expertise' },
    { id: 'Leadership', name: 'Governance & Policy' },
    { id: 'Research', name: 'Research & Analytics' },
    { id: 'Tech', name: 'Tech & Digital Innovation' },
    { id: 'Other', name: 'Office Productivity' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Database':
        return <HardDrive className="text-primary-500" size={22} />;
      case 'Development':
        return <Code className="text-accent-500" size={22} />;
      case 'Research':
        return <BarChart3 className="text-emerald-500" size={22} />;
      case 'Leadership':
        return <Award className="text-amber-500" size={22} />;
      default:
        return <Cpu className="text-slate-500" size={22} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Database': return 'from-primary-500 to-primary-600';
      case 'Development': return 'from-accent-500 to-accent-600';
      case 'Research': return 'from-emerald-500 to-emerald-600';
      case 'Leadership': return 'from-amber-500 to-amber-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getDisplayCategoryName = (category) => {
    switch (category) {
      case 'Leadership': return 'Governance, Leadership & Public Policy';
      case 'Research': return 'Research & Analytics';
      case 'Database': return 'Data Architecture & SQL Systems';
      case 'Development': return 'Technology & Digital Innovation';
      default: return 'Office & Productivity Suites';
    }
  };

  // Filter skills based on tab and search query
  const filteredSkills = skills.filter((skill) => {
    // 1. Category Filter
    let matchesCategory = true;
    if (activeTab === 'Leadership') {
      matchesCategory = skill.category === 'Leadership';
    } else if (activeTab === 'Research') {
      matchesCategory = skill.category === 'Research';
    } else if (activeTab === 'Tech') {
      matchesCategory = skill.category === 'Database' || skill.category === 'Development';
    } else if (activeTab === 'Other') {
      matchesCategory = skill.category === 'Other';
    }

    // 2. Search Query Filter
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Group filtered skills by category
  const categoriesInFiltered = [...new Set(filteredSkills.map(s => s.category))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Expertise Matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      {/* Header */}
      <section className="text-left max-w-3xl">
        <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Expertise & Competencies</span>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-2">
          Professional Matrix
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          Comprehensive capabilities spanning executive governance, public policy reform, mixed-method research analytics, and database systems architecture.
        </p>
      </section>

      {/* Professional Values Quote Card */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d4ed8]/5 to-indigo-600/5 dark:from-[#1d4ed8]/10 dark:to-indigo-600/5 border border-blue-100/50 dark:border-dark-800/80 p-8 sm:p-10 text-left">
          <div className="absolute -top-12 -right-12 text-blue-500/10 dark:text-blue-500/5 pointer-events-none">
            <Quote size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
              <BookOpen size={28} />
            </div>
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Professional Values
              </h3>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-350 italic leading-relaxed font-medium">
                "I am committed to delivering innovative, ethical, and data-driven solutions that strengthen institutions, improve governance, advance research excellence, and accelerate digital transformation across the public, private, and development sectors."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Controls: Search + Tabs */}
      <section className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-200/50 dark:border-dark-800/50 pb-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-dark-900/60 rounded-xl w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-grow md:flex-grow-0 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-655 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </section>

      {/* Skills Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <AnimatePresence mode="popLayout">
          {categoriesInFiltered.map((category) => {
            const categorySkills = filteredSkills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={category}
                className="bg-white dark:bg-dark-900/40 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 hover:shadow-md transition-all p-6 sm:p-8 space-y-6 text-left"
              >
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-100 dark:border-dark-800 pb-3">
                  {getCategoryIcon(category)} {getDisplayCategoryName(category)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-slate-700 dark:text-slate-250 truncate pr-2" title={skill.name}>
                          {skill.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">{skill.proficiency_percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency_percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r rounded-full ${getCategoryColor(category)}`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3">
            <Info className="mx-auto text-slate-400" size={36} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">No matching competencies found.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Try modifying your query or selecting another tab category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Skills;
