import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Clock,
  User,
  BookOpen,
  CheckCircle2,
  Newspaper,
  MessageCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

const BlogDetail = () => {
  const { identifier } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/blogs/${identifier}`);
        setBlog(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'ब्लॉग लोड करने में असमर्थ');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [identifier]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${blog?.title || 'मगरांचल खोज खबर'}\n`);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B71C1C] border-t-[#FACC15] rounded-full animate-spin mb-4" />
        <p className="text-slate-700 font-bold text-xs">समाचार लोड हो रहा है...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white border-2 border-[#B71C1C] text-slate-800 p-8 rounded-2xl space-y-4 shadow-md">
          <BookOpen className="w-12 h-12 mx-auto text-[#B71C1C]" />
          <h2 className="text-xl font-black text-[#B71C1C] font-newspaper">{error || 'यह समाचार उपलब्ध नहीं है।'}</h2>
          <p className="text-xs text-slate-600">
            हो सकता है कि यह समाचार 30 दिनों से अधिक पुराना होने के कारण आधिकारिक नीति के तहत हटा दिया गया हो।
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-[#B71C1C] text-[#FACC15] px-5 py-2.5 rounded-lg text-xs font-black shadow"
          >
            <ArrowLeft className="w-4 h-4" /> सभी समाचारों पर वापस लौटें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#B71C1C] hover:text-[#DC2626] transition bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> समाचार सूची पर वापस जाएं
        </Link>

        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          श्रेणी: <strong className="text-[#B71C1C]">{blog.category || 'Local News'}</strong>
        </span>
      </div>

      {/* Main Blog Article Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden border-t-4 border-t-[#B71C1C]">
        
        {/* Banner image */}
        {blog.imageUrl && (
          <div className="w-full h-80 sm:h-[450px] bg-[#0A0A0A] relative overflow-hidden">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <span className="absolute bottom-4 left-4 bg-[#B71C1C] text-[#FACC15] font-black text-xs uppercase px-3.5 py-1.5 rounded-md shadow-md border border-[#FACC15]/40">
              {blog.category || 'Local News'}
            </span>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug font-newspaper border-b-2 border-slate-100 pb-4">
            {blog.title}
          </h1>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-3 text-xs text-slate-600 bg-slate-50/60 px-4 rounded-xl">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                <User className="w-4 h-4 text-[#B71C1C]" />
                <span>{blog.author || 'मगरांचल खोज खबर रिपोर्टर'}</span>
              </span>

              <span className="text-slate-300 hidden sm:inline">|</span>

              <span className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-[#B71C1C]" />
                {new Date(blog.createdAt).toLocaleDateString('hi-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>

              <span className="text-slate-300 hidden sm:inline">|</span>

              <span className="flex items-center gap-1 text-slate-600">
                <Eye className="w-3.5 h-3.5 text-[#EAB308]" /> {blog.views || 1} व्यूज़
              </span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={shareOnWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-xs transition shadow-sm"
                title="WhatsApp पर शेयर करें"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button
                onClick={handleShare}
                className="bg-[#121212] hover:bg-[#27272A] text-[#FACC15] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition text-xs border border-[#27272A]"
                title="लिंक कॉपी करें"
              >
                <Copy className="w-3.5 h-3.5" /> {copied ? 'कॉपी हो गया!' : 'लिंक शेयर'}
              </button>
            </div>
          </div>

          {/* Verification & 30-Day Notice */}
          <div className="bg-[#0A0A0A] text-white border-l-4 border-[#B71C1C] p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-r-xl gap-2">
            <span className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
              <span>मगरांचल खोज खबर डिजिटल डेस्क द्वारा सत्यापित एवं प्रामाणिक खबर।</span>
            </span>
            <span className="flex items-center gap-1 text-[#FACC15] text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5" /> 30 दिनों तक उपलब्ध
            </span>
          </div>

          {/* Article Body */}
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
            {blog.content}
          </div>

        </div>

        {/* Footer info inside card */}
        <div className="bg-[#0A0A0A] text-white p-6 border-t-2 border-[#B71C1C] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <p className="font-black text-white font-newspaper text-sm">मगरांचल खोज खबर डिजिटल मीडिया नेटवर्क</p>
            <p className="text-slate-400 text-[11px] mt-0.5">मुख्य संपादक: राजू सिंह | सर्वाधिकार सुरक्षित © {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/newspapers"
              className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-black px-4 py-2 rounded-lg transition text-xs"
            >
              आज का ई-पेपर देखें
            </Link>
            <Link
              to="/blogs"
              className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] font-black px-4 py-2 rounded-lg transition text-xs"
            >
              अन्य समाचार
            </Link>
          </div>
        </div>

      </div>

    </article>
  );
};

export default BlogDetail;
