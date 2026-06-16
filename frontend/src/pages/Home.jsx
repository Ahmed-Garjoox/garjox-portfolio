import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileText, Lightbulb, MessageSquare, ArrowRight, Award, Mail, BarChart2 } from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import api from '../services/api';

const Home = () => {
  const [profile, setProfile] = useState({});
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentResearch, setRecentResearch] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Typing effect state
  const roles = ["Database Administrator", "Software Developer", "Database Engineer", "Data Analyst"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimer;
    const currentRole = roles[currentRoleIndex];
    
    if (isDeleting) {
      typingTimer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, 50);
    } else {
      typingTimer = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }, 100);
    }

    if (!isDeleting && displayText === currentRole) {
      typingTimer = setTimeout(() => setIsDeleting(true), 2000); // Wait before deleting
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(typingTimer);
  }, [displayText, isDeleting, currentRoleIndex]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Log page view in background
        api.post('analytics-log/', { page_path: '/' }).catch(() => {});

        // Fetch Data
        const [profileRes, projectsRes, researchRes, postsRes] = await Promise.all([
          api.get('profiles/'),
          api.get('projects/?is_featured=true'),
          api.get('research/'),
          api.get('posts/')
        ]);

        const profiles = profileRes.data.results || profileRes.data;
        if (profiles && profiles.length > 0) {
          setProfile(profiles[0]);
        }

        setFeaturedProjects((projectsRes.data.results || projectsRes.data).slice(0, 3));
        setRecentResearch((researchRes.data.results || researchRes.data).slice(0, 2));
        setRecentPosts((postsRes.data.results || postsRes.data).slice(0, 2));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Hub Experience...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-16 lg:py-24 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider">
                DATABASE & DATA ANALYSIS EXPERT
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight">
                Turning Data Into Actionable Insights
              </h1>
              <p className="text-lg text-blue-105 max-w-2xl leading-relaxed">
                Specializing in advanced database design, SQL optimization, ETL pipelines, and comprehensive data analytics solutions that drive real business value.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/projects"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#1d4ed8] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group"
                >
                  View Projects
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
            
            {/* Hero Image */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 p-3">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-white/20">
                    <Database size={96} className="text-white/40 animate-pulse-slow" />
                  </div>
                )}
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-slate-805 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Database size={16} className="text-[#1d4ed8] fill-current" />
                  <span>Data Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 hover:shadow-lg transition-all space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Database size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Database Administration</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Specialized in query plan tuning, connection pooling optimization, indexing heuristics, and sharded environments.
            </p>
          </div>
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 hover:shadow-lg transition-all space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400 flex items-center justify-center">
              <BarChart2 size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Data Analysis & BI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Transforming raw data into actionable insights, building analytical dashboards, and implementing ETL pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">My Showcase</span>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">Featured Work</h2>
          </div>
          <Link to="/projects" className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600">
            All Projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-200 dark:bg-dark-900 overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/5 to-accent-500/5 flex items-center justify-center">
                      <Database size={48} className="text-slate-300 dark:text-dark-700" />
                    </div>
                  )}
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-dark-900/95 shadow-sm text-primary-600 dark:text-primary-400">
                    {project.category_name}
                  </span>
                </div>
                <div className="p-6 space-y-3 text-left">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex flex-wrap gap-1.5 justify-start">
                {project.technologies_used?.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* CTA Visual Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900/10 dark:bg-slate-900/30 backdrop-blur-[1px]"></div>
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold">Have a complex database query that needs tuning?</h2>
            <p className="text-base text-sky-100">
              Or looking to collaborate on high-throughput computation systems and custom sharded structures? Let's connect and build a solution.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-md transition-all"
              >
                <MessageSquare size={18} /> Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
