import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { Search, Calendar, Eye, ArrowRight, Filter, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

const categories = ['All', 'Local News', 'Politics', 'Sports', 'Business', 'Opinion'];

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync state if search params in URL change
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    if (urlSearch !== null && urlSearch !== undefined) {
      setSearch(urlSearch);
    }
  }, [urlCategory, urlSearch]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/blogs', {
        params: {
          search,
          category: selectedCategory,
          page,
          limit: 9
        }
      });
      setBlogs(res.data.blogs || []);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Header Banner in Deep Black, Red & Gold */}
      <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#B71C1C] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACC15]/10 rounded-bl-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B71C1C] via-[#FACC15] to-[#B71C1C]"></div>

        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#B71C1C] text-[#FACC15] border border-[#FACC15]/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#FACC15]" /> मगरांचल विशेष समाचार व लेख
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-newspaper">
            मुख्य समाचार एवं ब्लॉग लेख
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            हमारे अनुभवी पत्रकारों और ब्यूरो प्रमुखों द्वारा संकलित विश्वसनीय ग्राउंड रिपोर्ट्स, राजनीतिक विश्लेषण और जनसरोकार के ताज़ा समाचार।
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border-2 border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-[#B71C1C] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-[#B71C1C] text-[#FACC15] border-[#FACC15] shadow-sm font-black'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-[#121212] hover:text-[#FACC15]'
              }`}
            >
              {cat === 'All' ? 'सभी समाचार' : cat === 'Local News' ? 'स्थानीय' : cat === 'Politics' ? 'राजनीति' : cat === 'Sports' ? 'खेल' : cat === 'Business' ? 'व्यापार' : 'संपादकीय'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="खबर खोजें... (Search news)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border-2 border-slate-300 rounded-l-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] px-4 py-2 rounded-r-lg text-xs font-black transition border-2 border-[#B71C1C]"
          >
            खोजें
          </button>
        </form>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-[#B71C1C] hover:shadow-lg transition duration-300 flex flex-col group"
            >
              <div className="h-48 bg-[#0A0A0A] relative overflow-hidden">
                {blog.imageUrl ? (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#121212] text-[#FACC15]">
                    <BookOpen className="w-10 h-10 text-slate-600" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-[#B71C1C] text-[#FACC15] font-black text-[10px] uppercase px-2.5 py-1 rounded shadow-md border border-[#FACC15]/40">
                  {blog.category || 'Local News'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center text-xs text-slate-500 gap-2 mb-2 font-medium">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-[#B71C1C]" />
                      {new Date(blog.createdAt).toLocaleDateString('hi-IN')}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-semibold">{blog.author || 'मगरांचल ब्यूरो'}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#B71C1C] transition line-clamp-2 leading-snug font-newspaper">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                    {blog.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#EAB308]" /> {blog.views || 0} व्यूज़
                  </span>
                  <Link
                    to={`/blogs/${blog.slug || blog._id}`}
                    className="text-xs font-bold text-[#B71C1C] hover:text-[#DC2626] flex items-center gap-1"
                  >
                    पूरा पढ़ें <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl text-center border-2 border-slate-200">
          <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-black text-slate-800 font-newspaper">कोई समाचार नहीं मिला</h3>
          <p className="text-xs text-slate-500 mt-1">
            आपके द्वारा खोजे गए शब्द या चयनित श्रेणी में वर्तमान में कोई परिणाम उपलब्ध नहीं है।
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-9 h-9 rounded-lg font-black text-xs transition border ${
                page === p
                  ? 'bg-[#B71C1C] text-[#FACC15] border-[#FACC15] shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-[#121212] hover:text-[#FACC15]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default Blogs;
