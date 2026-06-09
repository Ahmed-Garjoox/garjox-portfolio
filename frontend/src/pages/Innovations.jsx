import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertCircle, ShieldAlert, GitCommit, Layers, Target, ExternalLink, Info } from 'lucide-react';
import api from '../services/api';

const Innovations = () => {
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/innovations' }).catch(() => {});
    
    const fetchInnovations = async () => {
      try {
        const response = await api.get('innovations/');
        setInnovations(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching innovations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInnovations();
  }, []);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Concept':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      case 'Prototype':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30';
      case 'Beta':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30';
      case 'Production':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-dark-950/20 dark:text-slate-400';
    }
  };

  const getStagePercentage = (stage) => {
    switch (stage) {
      case 'Concept': return 25;
      case 'Prototype': return 50;
      case 'Beta': return 75;
      case 'Production': return 100;
      default: return 10;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Innovations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Showcase</span>
          <h1 className="text-4xl font-display font-extrabold text-white mt-2">
            Innovations & Proofs of Concept
          </h1>
          <p className="text-lg text-blue-105 mt-4 leading-relaxed max-w-3xl">
            Experimental prototypes, database utilities, and middleware engines designed to solve real-world scaling and architecture problems.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Grid of Innovations */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {innovations.map((inn) => (
          <div
            key={inn.id}
            className="bg-white dark:bg-dark-900/40 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 hover:shadow-lg transition-all p-6 sm:p-8 flex flex-col justify-between text-left space-y-6"
          >
            {/* Upper: Title & Badge */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white leading-tight">
                  {inn.idea}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${getStageColor(inn.development_stage)}`}>
                  {inn.development_stage}
                </span>
              </div>

              {/* Progress Line */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Development Stage Progression</span>
                  <span>{getStagePercentage(inn.development_stage)}% Completed</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-primary-500 rounded-full"
                    style={{ width: `${getStagePercentage(inn.development_stage)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Problem & Solution block */}
            <div className="space-y-4 text-sm">
              <div className="space-y-1 bg-slate-50 dark:bg-dark-950 p-4 rounded-xl border border-slate-150 dark:border-dark-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-amber-500" /> The Problem
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  {inn.problem}
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-dark-950 p-4 rounded-xl border border-slate-150 dark:border-dark-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lightbulb size={16} className="text-primary-500" /> Proposed Solution
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  {inn.solution}
                </p>
              </div>
            </div>

            {/* Impact & Future Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {inn.impact && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] text-slate-400">
                    Proven Impact
                  </span>
                  <p className="text-slate-600 dark:text-slate-450 leading-relaxed">
                    {inn.impact}
                  </p>
                </div>
              )}
              {inn.future_plans && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[10px] text-slate-400">
                    Future Roadmap
                  </span>
                  <p className="text-slate-600 dark:text-slate-450 leading-relaxed">
                    {inn.future_plans}
                  </p>
                </div>
              )}
            </div>

            {/* Prototype Link */}
            {inn.prototype_url && (
              <div className="pt-2 border-t border-slate-100 dark:border-dark-800 flex justify-end">
                <a
                  href={inn.prototype_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <ExternalLink size={13} /> View Prototype
                </a>
              </div>
            )}
          </div>
        ))}
        {innovations.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-2">
            <Info className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No innovations have been posted yet.</p>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default Innovations;
