import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Code, ShieldAlert, Award, Terminal, HardDrive, BarChart3, Info } from 'lucide-react';
import api from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Group skills by category
  const categories = ['Database', 'Development', 'Research', 'Leadership', 'Other'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Database':
        return <HardDrive className="text-primary-500" size={20} />;
      case 'Development':
        return <Code className="text-accent-500" size={20} />;
      case 'Research':
        return <BarChart3 className="text-emerald-500" size={20} />;
      case 'Leadership':
        return <Award className="text-amber-500" size={20} />;
      default:
        return <Terminal className="text-slate-500" size={20} />;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Skills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <section className="text-left max-w-3xl">
        <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Expertise</span>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-2">
          Skills & Technical Matrix
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          Proficiency metrics spanning physical data layout, high-performance web frameworks, mathematical consensus modeling, and engineering leadership.
        </p>
      </section>

      {/* Grid of categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => {
          const categorySkills = skills.filter(s => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div
              key={category}
              className="bg-white dark:bg-dark-900/40 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 hover:shadow-md transition-all p-6 sm:p-8 space-y-6 text-left"
            >
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-dark-800 pb-2">
                {getCategoryIcon(category)} {category}
              </h3>

              <div className="space-y-5">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700 dark:text-slate-250">{skill.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">{skill.proficiency_percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency_percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r rounded-full ${getCategoryColor(category)}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {skills.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-2">
            <Info className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No skills records found.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Skills;
