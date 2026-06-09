import React, { useState, useEffect } from 'react';
import { Mail, User, ShieldAlert, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/contact' }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await api.post('messages/', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Connect</span>
          <h1 className="text-4xl font-display font-extrabold text-white mt-2">
            Get in Touch
          </h1>
          <p className="text-lg text-blue-105 mt-4 leading-relaxed max-w-3xl">
            Reach out for consulting projects, sharding designs, query performance tuning, consensus modelling, or academic collaborations.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid split: Info card + Form card */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 space-y-6">
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">Contact Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Direct Email</span>
                  <a href="mailto:ahmed@example.com" className="text-slate-700 dark:text-slate-200 font-semibold hover:text-primary-500 transition-colors">
                    ahmed@example.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-950/50 text-accent-600 dark:text-accent-400 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Staff Role</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">
                    Ahmed Mahamud Ahmed
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-dark-800 pt-4">
              * Messages sent here will be logged and reviewed in the Admin Portal.
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-900/40 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-dark-800/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex gap-2.5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm font-semibold">
                <CheckCircle size={20} className="shrink-0 text-emerald-500" />
                <span>Message sent successfully! Ahmed will get back to you soon.</span>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400 text-sm font-semibold">
                <AlertTriangle size={20} className="shrink-0 text-red-500" />
                <span>Failed to send your message. Please check the network connectivity and try again.</span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-255 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                disabled={submitting}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-260 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-450 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Contact;
