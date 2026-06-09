import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import api from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log article views
    api.post('analytics-log/', { page_path: `/blog/${id}` }).catch(() => {});
    
    const fetchPost = async () => {
      try {
        const response = await api.get(`posts/${id}/`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 dark:border-dark-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-semibold animate-pulse">Retrieving Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article not found</h2>
        <p className="text-slate-500">The post you are trying to access does not exist or has been removed.</p>
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600">
          <ChevronLeft size={16} /> Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Blue Header Banner matching mockup theme */}
      <section className="w-full bg-[#1d4ed8] dark:bg-blue-950 text-white py-12 lg:py-16 -mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          {/* Back Button */}
          <div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-200 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> All Articles
            </Link>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
            {post.category_name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-blue-105">
            <span className="flex items-center gap-1.5">
              <User size={16} />
              {post.author_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {new Date(post.published_date || post.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {post.reading_time} min read
            </span>
          </div>
        </div>
      </section>

      {/* Main Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left pb-8">

      {/* Featured Image */}
      {post.featured_image && (
        <div className="rounded-3xl overflow-hidden aspect-[21/9] bg-slate-100 dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800/50">
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Body Content */}
      <div 
        className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 leading-relaxed text-sm sm:text-base space-y-6 pt-4 
        [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-slate-900 dark:[&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4
        [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-display [&>h3]:font-bold [&>h3]:text-slate-900 dark:[&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
        [&>h4]:text-base sm:[&>h4]:text-lg [&>h4]:font-display [&>h4]:font-bold [&>h4]:text-slate-900 dark:[&>h4]:text-white [&>h4]:mt-4 [&>h4]:mb-2
        [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
        [&>pre]:bg-slate-100 dark:[&>pre]:bg-dark-950 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-slate-200/50 dark:[&>pre]:border-dark-850 [&>pre]:text-xs [&>pre]:mb-4
        [&>code]:bg-slate-100 dark:[&>code]:bg-dark-950 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags details */}
      {post.tags_details && post.tags_details.length > 0 && (
        <div className="pt-8 border-t border-slate-200/50 dark:border-dark-800/50 flex flex-wrap gap-2 justify-start items-center">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            Tags:
          </span>
          {post.tags_details.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800/50 text-xs font-semibold text-slate-600 dark:text-slate-350"
            >
              <Tag size={10} /> {tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
    </div>
  );
};

export default BlogPost;
