import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import { 
  LayoutDashboard, FileText, Database, Lightbulb, MessageSquare, 
  Settings, LogOut, Trash2, Edit2, Check, X, Shield, Plus, Eye, EyeOff, Award, User, Save,
  GitBranch, Calendar, Code, Server, Users, Edit3, Home as HomeIcon, Mail, ArrowLeft
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [innovations, setInnovations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [appSettings, setAppSettings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileFormData, setProfileFormData] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState(null);

  // Form selections options
  const [projectCats, setProjectCats] = useState([]);
  const [blogCats, setBlogCats] = useState([]);
  const [tags, setTags] = useState([]);

  // UI Control states
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, projectsRes, 
        postsRes, skillsRes, messagesRes, settingsRes,
        projectCatsRes, blogCatsRes, tagsRes, profileRes
      ] = await Promise.all([
        api.get('dashboard/stats/'),
        api.get('projects/'),
        api.get('posts/'), // Admins see all posts via permission class
        api.get('skills/'),
        api.get('messages/'),
        api.get('settings/'),
        api.get('project-categories/'),
        api.get('categories/'),
        api.get('tags/'),
        api.get('profiles/')
      ]);

      setStats(statsRes.data);
      setProjects(projectsRes.data.results || projectsRes.data);
      setPosts(postsRes.data.results || postsRes.data);
      setSkills(skillsRes.data.results || skillsRes.data);
      setMessages(messagesRes.data.results || messagesRes.data);
      setAppSettings(settingsRes.data.results || settingsRes.data);
      
      setProjectCats(projectCatsRes.data.results || projectCatsRes.data);
      setBlogCats(blogCatsRes.data.results || blogCatsRes.data);
      setTags(tagsRes.data.results || tagsRes.data);

      const profiles = profileRes.data.results || profileRes.data;
      if (profiles && profiles.length > 0) {
        const p = profiles[0];
        setProfile(p);
        setProfileFormData({
          name: p.name || '',
          biography: p.biography || '',
          education: p.education || '',
          journey: p.journey || '',
          goals: p.goals || '',
          vision: p.vision || '',
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard database details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setProfileSaving(true);
    setProfileSaveStatus(null);
    try {
      const fd = new FormData();
      Object.keys(profileFormData).forEach(key => fd.append(key, profileFormData[key]));
      if (profileFile) fd.append('profile_image', profileFile);
      if (cvFile) fd.append('cv', cvFile);
      await api.patch(`profiles/${profile.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfileSaveStatus('success');
      setProfileFile(null);
      setCvFile(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
      setProfileSaveStatus('error');
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileSaveStatus(null), 4000);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Message Operations
  const handleToggleRead = async (msgId, currentStatus) => {
    try {
      await api.patch(`messages/${msgId}/`, { is_read: !currentStatus });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_read: !currentStatus } : m));
      // Refresh stats totals
      const statsRes = await api.get('dashboard/stats/');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      await api.delete(`messages/${msgId}/`);
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Generic Delete Handler
  const handleDeleteItem = async (endpoint, id) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) return;
    try {
      await api.delete(`${endpoint}/${id}/`);
      fetchDashboardData();
    } catch (error) {
      console.error(`Error deleting item from ${endpoint}:`, error);
    }
  };

  // Open forms for Create or Edit
  const openForm = (tabType, item = null) => {
    setCurrentEditItem(item);
    setSelectedFile(null);
    
    if (item) {
      // populate for edit
      const copy = { ...item };
      // normalize structures
      if (tabType === 'projects' && item.technologies_used) {
        copy.technologies_used = item.technologies_used.join(', ');
      }
      setFormData(copy);
    } else {
      // initialize empty
      setFormData(getInitialFormData(tabType));
    }
    setFormOpen(true);
  };

  const getInitialFormData = (tabType) => {
    switch (tabType) {
      case 'projects':
        return { title: '', description: '', category: projectCats[0]?.id || '', status: 'In Progress', github_link: '', demo_link: '', documentation_url: '', case_study: '', is_featured: false, created_date: new Date().toISOString().split('T')[0] };
      case 'posts':
        return { title: '', content: '', category: blogCats[0]?.id || '', tags: [], status: 'Draft', reading_time: 5 };
      case 'innovations':
        return { idea: '', problem: '', solution: '', prototype_url: '', impact: '', development_stage: 'Concept', future_plans: '' };
      case 'skills':
        return { name: '', proficiency_percentage: 80, category: 'Development' };
      default:
        return {};
    }
  };

  // Form Change Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTagsSelection = (tagId) => {
    const currentSelectedTags = formData.tags || [];
    if (currentSelectedTags.includes(tagId)) {
      setFormData(prev => ({ ...prev, tags: currentSelectedTags.filter(id => id !== tagId) }));
    } else {
      setFormData(prev => ({ ...prev, tags: [...currentSelectedTags, tagId] }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'posts' ? 'posts' : activeTab;
    const isEdit = !!currentEditItem;

    try {
      // Normalize comma-separated strings to arrays
      const payload = { ...formData };
      if (activeTab === 'projects') {
        payload.technologies_used = typeof payload.technologies_used === 'string' 
          ? payload.technologies_used.split(',').map(s => s.trim()).filter(Boolean)
          : payload.technologies_used || [];
      }
      // Handle File uploads if present
      let requestConfig = {};
      let submitBody = payload;
      
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'technologies_used' || key === 'keywords') {
            fd.append(key, JSON.stringify(payload[key]));
          } else if (key === 'tags') {
            const tagList = Array.isArray(payload[key]) ? payload[key] : [];
            tagList.forEach(id => fd.append('tags', id));
          } else {
            fd.append(key, payload[key]);
          }
        });
        
        const fileField = activeTab === 'projects' ? 'cover_image' : 'featured_image';
        fd.append(fileField, selectedFile);
        submitBody = fd;
        requestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
      }

      if (isEdit) {
        await api.put(`${endpoint}/${currentEditItem.id}/`, submitBody, requestConfig);
      } else {
        await api.post(`${endpoint}/`, submitBody, requestConfig);
      }

      setFormOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting form data:', error.response?.data || error.message);
      alert(JSON.stringify(error.response?.data || 'Failed to submit form data. Please check logs.'));
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Analytics & Metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      {/* Upper Title and Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 dark:border-dark-800/50 pb-6">
        <div>
          <span className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-1">
            <Shield size={14} /> Administrator Portal
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1">
            Control Panel
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-300 dark:border-red-950 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold rounded-lg transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Dashboard Workspace */}
      <div className="space-y-6">
          {/* OVERVIEW STATS TAB */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-10">
              {/* Welcome Banner */}
              <div className="text-left">
                <h2 className="text-2xl font-bold text-slate-805 dark:text-white">Welcome back, {user?.first_name || 'Ahmed'}!</h2>
              </div>

              {/* Stats Count cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Projects */}
                <div className="bg-white dark:bg-dark-900 border-l-[6px] border-blue-600 shadow-sm p-6 rounded-2xl flex flex-col justify-between items-start min-h-[140px] text-left">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-905 dark:text-white block">
                      {stats.totals?.projects || 0}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5 block">
                      TOTAL PROJECTS
                    </span>
                  </div>
                  <GitBranch size={20} className="text-[#1d4ed8] dark:text-blue-400 mt-4" />
                </div>

                {/* Card 2: Projects This Month */}
                <div className="bg-white dark:bg-dark-900 border-l-[6px] border-blue-600 shadow-sm p-6 rounded-2xl flex flex-col justify-between items-start min-h-[140px] text-left">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-905 dark:text-white block">
                      {projects?.filter(p => {
                        if (!p.created_date) return false;
                        const date = new Date(p.created_date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                      }).length || 0}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5 block">
                      PROJECTS THIS MONTH
                    </span>
                  </div>
                  <Calendar size={20} className="text-[#1d4ed8] dark:text-blue-400 mt-4" />
                </div>

                {/* Card 3: Technologies Used */}
                <div className="bg-white dark:bg-dark-900 border-l-[6px] border-blue-600 shadow-sm p-6 rounded-2xl flex flex-col justify-between items-start min-h-[140px] text-left">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-905 dark:text-white block">
                      {new Set(projects?.flatMap(p => p.technologies_used || [])).size || 0}
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5 block">
                      TECHNOLOGIES USED
                    </span>
                  </div>
                  <Code size={20} className="text-[#1d4ed8] dark:text-blue-400 mt-4" />
                </div>

                {/* Card 4: System Uptime */}
                <div className="bg-white dark:bg-dark-900 border-l-[6px] border-blue-600 shadow-sm p-6 rounded-2xl flex flex-col justify-between items-start min-h-[140px] text-left">
                  <div>
                    <span className="text-4xl font-extrabold text-slate-905 dark:text-white block">
                      24/7
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5 block">
                      SYSTEM UPTIME
                    </span>
                  </div>
                  <Server size={20} className="text-[#1d4ed8] dark:text-blue-400 mt-4" />
                </div>
              </div>

              {/* Grid of Action Buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Action 1: Manage Projects */}
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <Database size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">Portfolio Projects</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Add, edit, or delete projects</span>
                  </button>

                  {/* Action 2: Manage Posts */}
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <FileText size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">Articles & Blog</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Write and publish blog posts</span>
                  </button>


                  {/* Action 4: Manage Skills */}
                  <button 
                    onClick={() => setActiveTab('skills')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <Code size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">Professional Skills</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Configure capability percentages</span>
                  </button>

                  {/* Action 5: View Messages */}
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <Mail size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">Message Inbox</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Check contact submissions</span>
                  </button>

                  {/* Action 6: Edit Profile */}
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <User size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">My Profile</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Update public profile info</span>
                  </button>

                  {/* Action 7: System Settings */}
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <Settings size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">System Settings</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Configure global app settings</span>
                  </button>

                  {/* Action 8: Manage User Accounts (Django Admin) */}
                  <a 
                    href="http://localhost:8001/admin/auth/user/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white dark:bg-dark-900 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-dark-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all group min-h-[140px]"
                  >
                    <Users size={28} className="text-[#1d4ed8] dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">User Accounts</span>
                    <span className="text-[11px] text-slate-400 block font-normal">Manage admin users in Django</span>
                  </a>
                </div>
              </div>


            </div>
          )}

          {/* PROFILE MANAGEMENT PANEL */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="bg-white dark:bg-dark-900/60 p-6 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-dark-850 pb-4">
                <div>
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-widest flex items-center gap-1"><User size={13} /> My Profile</span>
                  <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">Edit Public Profile</h3>
                </div>
                {profile?.profile_image && (
                  <img src={profile.profile_image} alt="Profile" className="w-14 h-14 rounded-xl object-cover border-2 border-primary-200 dark:border-primary-900/40" />
                )}
              </div>

              {profileSaveStatus === 'success' && (
                <div className="flex gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm font-semibold">
                  <Check size={18} className="shrink-0 text-emerald-500" /> Profile updated successfully!
                </div>
              )}
              {profileSaveStatus === 'error' && (
                <div className="flex gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400 text-sm font-semibold">
                  <X size={18} className="shrink-0 text-red-500" /> Failed to save profile. Please try again.
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Display Name</label>
                    <input type="text" name="name" value={profileFormData.name || ''} onChange={handleProfileInputChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files[0])} className="w-full text-xs py-1" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Biography</label>
                  <textarea name="biography" value={profileFormData.biography || ''} onChange={handleProfileInputChange} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" placeholder="Tell the world about yourself..." />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Professional Journey</label>
                  <textarea name="journey" value={profileFormData.journey || ''} onChange={handleProfileInputChange} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" placeholder="Your career path, key milestones..." />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Education</label>
                  <textarea name="education" value={profileFormData.education || ''} onChange={handleProfileInputChange} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" placeholder="Degrees, institutions, years..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Vision</label>
                    <textarea name="vision" value={profileFormData.vision || ''} onChange={handleProfileInputChange} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" placeholder="Your long-term vision..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Goals</label>
                    <textarea name="goals" value={profileFormData.goals || ''} onChange={handleProfileInputChange} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" placeholder="Short and long-term goals..." />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">CV / Resume File (PDF)</label>
                  {profile?.cv && (
                    <a href={profile.cv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 mb-1 block">
                      Current CV on file — click to view
                    </a>
                  )}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="w-full text-xs py-1" />
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-dark-800">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-450 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    {profileSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
            </div>
          )}

          {/* CRUD PANELS */}
          {activeTab !== 'overview' && activeTab !== 'profile' && (
            <div className="space-y-4">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div className="bg-white dark:bg-dark-900/60 p-6 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 space-y-6">
              
              {/* Header inside Panel */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-dark-850 pb-4">
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white capitalize">
                  Manage {activeTab}
                </h3>
                {activeTab !== 'messages' && activeTab !== 'settings' && (
                  <button
                    onClick={() => openForm(activeTab)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-650 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Plus size={14} /> Add Record
                  </button>
                )}
              </div>

              {/* PROJECTS CRUD LIST */}
              {activeTab === 'projects' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-dark-850 text-slate-450 text-xs font-extrabold uppercase">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-850">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-slate-50/20 dark:hover:bg-dark-900/10">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{proj.title}</td>
                          <td className="py-3 text-slate-500">{proj.category_name}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-primary-100 text-primary-800'
                            }`}>
                              {proj.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openForm('projects', proj)} className="p-1 hover:text-primary-500 transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteItem('projects', proj.id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* POSTS/BLOG CRUD LIST */}
              {activeTab === 'posts' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-dark-850 text-slate-450 text-xs font-extrabold uppercase">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-850">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50/20 dark:hover:bg-dark-900/10">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{post.title}</td>
                          <td className="py-3 text-slate-500">{post.category_name}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              post.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openForm('posts', post)} className="p-1 hover:text-primary-500 transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteItem('posts', post.id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}




              {/* SKILLS CRUD LIST */}
              {activeTab === 'skills' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-dark-850 text-slate-450 text-xs font-extrabold uppercase">
                        <th className="pb-3">Skill Name</th>
                        <th className="pb-3">Proficiency</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-850">
                      {skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-slate-50/20 dark:hover:bg-dark-900/10">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{skill.name}</td>
                          <td className="py-3 text-slate-500">{skill.proficiency_percentage}%</td>
                          <td className="py-3 text-slate-500 capitalize">{skill.category}</td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openForm('skills', skill)} className="p-1 hover:text-primary-500 transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteItem('skills', skill.id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* MESSAGE INBOX MANAGER */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-5 rounded-2xl border transition-all space-y-3 ${
                        msg.is_read 
                          ? 'bg-slate-50/40 dark:bg-dark-950/20 border-slate-150 dark:border-dark-850'
                          : 'bg-primary-50/10 dark:bg-primary-950/5 border-primary-200/50 dark:border-primary-900/20 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                          <span className="text-xs text-slate-400 block sm:inline sm:ml-2">({msg.email})</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleRead(msg.id, msg.is_read)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                              msg.is_read 
                                ? 'bg-slate-100 dark:bg-dark-950 text-slate-505 border-slate-200' 
                                : 'bg-primary-600 text-white border-transparent shadow-sm'
                            }`}
                          >
                            {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Subject: {msg.subject}</span>
                        <p className="text-xs text-slate-650 dark:text-slate-350 bg-white dark:bg-dark-950 p-3 rounded-xl border border-slate-100 dark:border-dark-850 whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-6">Your inbox is currently empty.</p>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {appSettings.map((set) => (
                    <div key={set.id} className="p-4 bg-slate-50 dark:bg-dark-950 rounded-xl border border-slate-200/50 dark:border-dark-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">{set.key}</span>
                        <p className="text-xs text-slate-500">{set.value || 'Not Configured'}</p>
                      </div>
                      <button
                        onClick={() => {
                          const val = window.prompt(`Update value for ${set.key}:`, set.value || '');
                          if (val !== null) {
                            api.put(`settings/${set.id}/`, { key: set.key, value: val })
                              .then(() => fetchDashboardData());
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-900 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit2 size={12} /> Edit Value
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
            </div>
          )}

      </div>

      {/* OVERLAY POPUP FORMS (CREATE / EDIT) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setFormOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
          
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-left">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-850 text-slate-450 hover:text-slate-900 transition-all"
            >
              <X size={20} />
            </button>

            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-dark-800">
              {currentEditItem ? 'Edit Record' : 'Create Record'} - {activeTab}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              {/* PROJECTS FORM */}
              {activeTab === 'projects' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Title</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} required rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Category</label>
                      <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950">
                        {projectCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Status</label>
                      <select name="status" value={formData.status || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950">
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Technologies (Comma separated)</label>
                      <input type="text" name="technologies_used" value={formData.technologies_used || ''} onChange={handleInputChange} placeholder="React, Django, Redis" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Project Cover Image</label>
                      <input type="file" onChange={handleFileChange} className="w-full text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">GitHub URL</label>
                      <input type="url" name="github_link" value={formData.github_link || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Demo URL</label>
                      <input type="url" name="demo_link" value={formData.demo_link || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Created Date</label>
                      <input type="date" name="created_date" value={formData.created_date || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Case Study content (Markdown rich text)</label>
                    <textarea name="case_study" value={formData.case_study || ''} onChange={handleInputChange} rows={5} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 resize-none" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleInputChange} id="is_featured" />
                    <label htmlFor="is_featured" className="text-xs font-bold text-slate-650 cursor-pointer">Feature this project on Home</label>
                  </div>
                </>
              )}

              {/* POSTS FORM */}
              {activeTab === 'posts' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Title</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Category</label>
                      <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950">
                        {blogCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Status</label>
                      <select name="status" value={formData.status || ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Reading Time (minutes)</label>
                      <input type="number" name="reading_time" value={formData.reading_time || 5} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Featured Image</label>
                      <input type="file" onChange={handleFileChange} className="w-full text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Publish Date (Leave blank for draft)</label>
                      <input type="datetime-local" name="published_date" value={formData.published_date ? formData.published_date.slice(0, 16) : ''} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                  </div>

                  {/* Multiselect Tags */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 block mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const isSelected = (formData.tags || []).includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagsSelection(tag.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              isSelected 
                                ? 'bg-accent-600 text-white border-transparent' 
                                : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-850'
                            }`}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Content (HTML allowed)</label>
                    <textarea name="content" value={formData.content || ''} onChange={handleInputChange} required rows={8} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950 font-mono text-xs resize-none" />
                  </div>
                </>
              )}




              {/* SKILLS FORM */}
              {activeTab === 'skills' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400">Skill Name</label>
                      <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Proficiency percentage (0-100)</label>
                      <input type="number" name="proficiency_percentage" min="0" max="100" value={formData.proficiency_percentage || 80} onChange={handleInputChange} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Category</label>
                    <select name="category" value={formData.category || 'Development'} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-850 dark:bg-dark-950">
                      <option value="Database">Database</option>
                      <option value="Development">Development</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 dark:border-dark-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-slate-350 dark:border-dark-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
