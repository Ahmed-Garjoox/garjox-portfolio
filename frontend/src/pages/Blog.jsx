import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Calendar, ArrowRight, Tag, Info } from 'lucide-react';
import api from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('analytics-log/', { page_path: '/blog' }).catch(() => {});
    
    const fetchBlogData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('posts/'),
          api.get('categories/')
        ]);
        
        setPosts(postsRes.data.results || postsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category_slug === selectedCategory || 
      String(post.category) === String(selectedCategory);
      
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Extract clean text from HTML content for descriptions
  const getExcerpt = (htmlString, maxLength = 160) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Loading Articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Articles</span>
          <h1 className="text-4xl font-display font-extrabold text-white mt-2">
            Engineering Logs & System Insights
          </h1>
          <p className="text-lg text-blue-105 mt-4 leading-relaxed max-w-3xl">
            Technical deep-dives on PostgreSQL sharding, React Compilers, containerized poolers, and consensus mechanics.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Control Bar */}
        <section className="flex flex-col items-center gap-6 bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/60 dark:border-dark-800/60 shadow-sm">
          {/* Search */}
          <div className="relative w-full max-w-3xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-dark-950 text-slate-655 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-dark-850'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-accent-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-dark-950 text-slate-655 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-dark-850'
                }`}
              >
                {cat.name} ({cat.post_count})
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl glass-card border border-slate-200/50 dark:border-dark-800/50 hover:shadow-xl transition-all text-left"
          >
            <div>
              {/* Image header */}
              <div className="relative h-48 bg-slate-200 dark:bg-dark-950 overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-500/5 to-primary-500/5 flex items-center justify-center">
                    <Clock size={40} className="text-slate-300 dark:text-dark-800" />
                  </div>
                )}
                {/* Category tag */}
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-accent-500 text-white shadow-sm">
                  {post.category_name}
                </span>
              </div>

              {/* Info block */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(post.published_date || post.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {post.reading_time} min read
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-accent-500 transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-xs text-slate-600 dark:text-slate-450 line-clamp-3 leading-relaxed">
                  {getExcerpt(post.content)}
                </p>
              </div>
            </div>

            {/* Tags and Action */}
            <div className="px-6 pb-6 pt-2 space-y-4">
              <div className="flex flex-wrap gap-1.5 justify-start">
                {post.tags_details?.map((tag) => (
                  <span key={tag.id} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-850 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <Tag size={8} /> {tag.name}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-slate-100 dark:border-dark-850 pt-3 flex items-center justify-end text-xs font-bold text-accent-500 group-hover:text-accent-600 group-hover:translate-x-1.5 transition-all">
                Read Article <ArrowRight size={14} className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-2">
            <Info className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">No articles match your parameters.</p>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default Blog;
