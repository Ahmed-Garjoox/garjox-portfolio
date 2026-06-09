import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, BookOpen, X, Code, Server, Info } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/projects' }).catch(() => {});
    
    const fetchProjectsData = async () => {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          api.get('projects/'),
          api.get('project-categories/')
        ]);
        
        setProjects(projectsRes.data.results || projectsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || 
      project.category_slug === selectedCategory || 
      String(project.category) === String(selectedCategory);
      
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies_used.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Portfolio</span>
          <h1 className="text-4xl font-display font-extrabold text-white mt-2">
            Engineering & Database Systems
          </h1>
          <p className="text-lg text-blue-105 mt-4 leading-relaxed max-w-3xl">
            A showcase of custom database tuners, consensus simulations, analytical dashboards, and robust web applications.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Filters & Search Control */}
        <section className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-800/60 shadow-sm">
          {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-dark-950 text-slate-650 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-dark-850'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-dark-950 text-slate-650 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-dark-850'
              }`}
            >
              {cat.name} ({cat.project_count})
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <motion.div
            layout
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 hover:shadow-xl transition-all"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 bg-slate-100 dark:bg-dark-950 overflow-hidden">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/5 to-accent-500/5 flex items-center justify-center">
                    <Code size={48} className="text-slate-300 dark:text-dark-800" />
                  </div>
                )}
                {/* Status Badge */}
                <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                  project.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : project.status === 'In Progress'
                    ? 'bg-primary-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {project.status}
                </span>
                {/* Category Badge */}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/95 dark:bg-dark-900/95 shadow-sm text-slate-800 dark:text-slate-250">
                  {project.category_name}
                </span>
              </div>

              {/* Info content */}
              <div className="p-6 space-y-3 text-left">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 pb-6 pt-2 space-y-4">
              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 justify-start">
                {project.technologies_used?.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-850 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-slate-100 dark:border-dark-850 pt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <BookOpen size={15} /> Case Study
                </button>
                <div className="flex gap-2">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                      title="GitHub Repository"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                      title="Live Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-2">
            <Info className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No projects match your criteria.</p>
          </div>
        )}
      </section>

      {/* Case Study Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-450 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
                  {selectedProject.category_name}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white pr-8">
                  {selectedProject.title}
                </h2>
              </div>

              {/* Case Study Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base mb-2">Project Summary</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                  {selectedProject.case_study && (
                    <div>
                      <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base mb-2 border-b border-slate-100 dark:border-dark-800 pb-1">
                        Technical Deep-Dive & Case Study
                      </h4>
                      <div className="text-sm text-slate-650 dark:text-slate-300 whitespace-pre-wrap leading-relaxed space-y-4">
                        {selectedProject.case_study}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 space-y-6 bg-slate-50 dark:bg-dark-950 p-6 rounded-2xl border border-slate-150 dark:border-dark-850">
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technologies</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies_used?.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-850 text-xs font-semibold text-slate-650 dark:text-slate-350">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status</h5>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      selectedProject.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-primary-100 text-primary-800 dark:bg-primary-950/20 dark:text-primary-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedProject.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary-500'
                      }`}></span>
                      {selectedProject.status}
                    </span>
                  </div>

                  {selectedProject.created_date && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Created</h5>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                        {selectedProject.created_date}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    {selectedProject.github_link && (
                      <a
                        href={selectedProject.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {selectedProject.demo_link && (
                      <a
                        href={selectedProject.demo_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {selectedProject.documentation_url && (
                      <a
                        href={selectedProject.documentation_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-350 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-900 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                      >
                        Documentation
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Extra Images Carousel if exists */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-dark-850">
                  <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base">Project Media Gallery</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.images.map((img) => (
                      <div key={img.id} className="relative rounded-xl overflow-hidden group bg-slate-100 dark:bg-dark-950 border border-slate-200/50 dark:border-dark-800/50">
                        <img src={img.image} alt={img.caption || 'Screenshot'} className="w-full h-40 object-cover" />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-2 text-[10px] text-white text-center">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
