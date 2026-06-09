import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LayoutDashboard, LogIn, User, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Research', path: '/research' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Database size={26} className="fill-blue-600/10" />
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Ahmed Mahamud Ahmed
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100/50 dark:hover:bg-dark-900/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Dashboard or Login */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-dark-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-900 text-sm font-semibold transition-colors"
              >
                <LogIn size={16} />
                Portal
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass shadow-xl border-t border-slate-200/50 dark:border-dark-800/50 py-4 px-6 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-dark-900/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-200/50 dark:border-dark-800/50 my-2 pt-2">
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary-600 text-white font-bold text-center shadow-sm"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-slate-300 dark:border-dark-700 text-slate-700 dark:text-slate-300 font-bold text-center"
                >
                  <LogIn size={18} />
                  Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
