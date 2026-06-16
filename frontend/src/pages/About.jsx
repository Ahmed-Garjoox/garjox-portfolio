import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Eye, Download, GraduationCap, ArrowRight, Mail } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import api from '../services/api';

const About = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        api.post('analytics-log/', { page_path: '/about' }).catch(() => {});
        const response = await api.get('profiles/');
        const profiles = response.data.results || response.data;
        if (profiles && profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Biography...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Header Section matching Image 2 */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-16 lg:py-24 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-sm font-extrabold uppercase tracking-widest text-blue-200">
                HELLO, I'M
              </span>
              <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight uppercase">
                AHMED GARJOOX
              </h1>
              <h2 className="text-xl lg:text-2xl font-bold text-blue-100 leading-snug">
                Passionate database professional with expertise in data analysis and business intelligence
              </h2>
              <p className="text-base text-blue-105 leading-relaxed">
                I am a dedicated database and data analysis professional with over 10 years of experience in designing, implementing, and optimizing database solutions that drive business success. My expertise spans across the entire data lifecycle - from database architecture and design to complex SQL development, ETL processes, and advanced analytics. I specialize in creating efficient, scalable database systems that serve as the foundation for data-driven decision making.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/projects"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#1d4ed8] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group"
                >
                  View My Work
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 px-6 py-3.5 border border-white hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                >
                  Get In Touch
                  <Mail size={18} />
                </Link>
              </div>
            </div>
            
            {/* Hero Image with decorative frame corners */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative p-6">
                {/* Decorative border corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 p-2">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                      <GraduationCap size={96} className="text-white/40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">
          {/* Quick Contact & CV Info */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="glass-card border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 text-center space-y-6">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">{profile.name || "Ahmed Garjoox"}</h2>
                <p className="text-sm text-primary-500 dark:text-primary-400 font-semibold uppercase tracking-wider">
                  Database Engineer & Data Analyst
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <a
                  href="https://github.com/ahmedmahamud"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg border border-slate-250 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-900 text-slate-655 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                  title="GitHub Profile"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://linkedin.com/in/ahmedmahamud"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg border border-slate-250 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-900 text-slate-655 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
                {profile.cv && (
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-md"
                  >
                    <Download size={16} /> Download CV
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Academic & Scientific Bio */}
          <div className="lg:col-span-8 space-y-10 text-left">
            {profile.biography && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 font-display font-bold text-2xl text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-dark-800/50 pb-2">
                  <BookOpen size={22} className="text-primary-500" /> Professional Biography & Focus
                </h2>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                  {profile.biography}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Grid: Education + Vision + Goals */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
          {/* Education Card */}
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 space-y-4 hover:shadow-lg transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Education</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {profile.education || "Details not set."}
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 space-y-4 hover:shadow-lg transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400 flex items-center justify-center">
              <Eye size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Vision</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {profile.vision || "Details not set."}
            </div>
          </div>

          {/* Goals Card */}
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 space-y-4 hover:shadow-lg transition-all text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Goals</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {profile.goals || "Details not set."}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
