import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUp } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100 dark:bg-dark-950 border-t border-slate-200/50 dark:border-dark-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/About */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white block">
              Ahmed Mahamud Ahmed
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              Researcher, Database Administrator, Writer, and Software Developer. Building robust databases and open-source solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-200/50 dark:bg-dark-900 text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-200/50 dark:bg-dark-900 text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:ahmed@example.com"
                className="p-2 rounded-full bg-slate-200/50 dark:bg-dark-900 text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Biography & About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Portfolio Projects
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Research Papers
                </Link>
              </li>

            </ul>
          </div>

          {/* Core Areas */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Articles & Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/50 dark:border-dark-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {currentYear} Ahmed Mahamud Ahmed. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors"
          >
            Back to top
            <ArrowUp size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
