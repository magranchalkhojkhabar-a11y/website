import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Newspaper,
  Download,
  Eye,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Clock,
  UserCheck,
  Instagram,
  Youtube,
  Facebook,
  TrendingUp,
  Flame,
  Award,
  Share2,
  Radio,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [latestNewspaper, setLatestNewspaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, newspaperRes] = await Promise.all([
          axios.get('/api/blogs?limit=12'),
          axios.get('/api/newspapers/latest').catch(() => ({ data: null }))
        ]);

        setBlogs(blogsRes.data.blogs || []);
        setLatestNewspaper(newspaperRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (e, paper) => {
    e.preventDefault();
    try {
      await axios.post(`/api/newspapers/${paper._id}/download`);
      window.open(paper.pdfUrl, '_blank');
    } catch (err) {
      window.open(paper.pdfUrl, '_blank');
    }
  };

  const leadBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 5);
  const categoryList = ['All', 'Local News', 'Politics', 'Sports', 'Business', 'Opinion'];
  
  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => (b.category || 'Local News').toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 font-sans">
      
      {/* 1. PROFESSIONAL NEWS AGENCY HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Lead Main Story (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#0A0A0A] text-white rounded-2xl overflow-hidden border-2 border-[#B71C1C] shadow-lg relative group">
          {leadBlog ? (
            <div className="relative flex flex-col justify-end min-h-[420px] sm:min-h-[460px] p-6 sm:p-8 bg-gradient-to-t from-black via-[#0A0A0A]/90 to-transparent">
              {leadBlog.imageUrl && (
                <img
                  src={leadBlog.imageUrl}
                  alt={leadBlog.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition duration-700"
                />
              )}

              {/* Decorative Red & Gold Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B71C1C] via-[#FACC15] to-[#B71C1C]"></div>

              <div className="relative z-10 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#B71C1C] text-[#FACC15] font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-md border border-[#FACC15]/40 flex items-center gap-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                    मुख्य समाचार (Lead Story)
                  </span>

                  <span className="bg-black/60 backdrop-blur-sm text-slate-300 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-[#27272A] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
                    {new Date(leadBlog.createdAt).toLocaleDateString('hi-IN')}
                  </span>

                  <span className="text-[11px] text-[#FACC15] font-bold">
                    {leadBlog.category || 'Local News'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3.5xl font-black text-white leading-snug font-newspaper group-hover:text-yellow-300 transition duration-300 drop-shadow">
                  <Link to={`/blogs/${leadBlog.slug || leadBlog._id}`}>
                    {leadBlog.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {leadBlog.content.replace(/<[^>]*>?/gm, '')}
                </p>

                <div className="pt-3 flex items-center justify-between border-t border-[#27272A]">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                    <span>रिपोर्टर: <strong className="text-white">{leadBlog.author || 'मगरांचल ब्यूरो'}</strong></span>
                  </div>

                  <Link
                    to={`/blogs/${leadBlog.slug || leadBlog._id}`}
                    className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white font-black text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shadow-md border border-[#FACC15]/30"
                  >
                    विस्तार से पढ़ें <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-semibold">ताज़ा समाचार लोड हो रहा है...</p>
            </div>
          )}
        </div>

        {/* Side Rail: E-Paper Kiosk & Top 4 Headlines (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* E-Paper Spotlight Kiosk Box */}
          <div className="bg-[#0A0A0A] border-2 border-[#FACC15] rounded-2xl overflow-hidden shadow-md">
            {/* Golden Header */}
            <div className="bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] px-4 py-2.5 flex items-center justify-between text-black">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                <Newspaper className="w-4 h-4 text-[#B71C1C]" />
                <span>दैनिक डिजिटल ई-पेपर (E-Paper)</span>
              </div>
              <span className="bg-[#0A0A0A] text-[#FACC15] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                PDF EDITION
              </span>
            </div>

            <div className="p-4 sm:p-5 text-white space-y-3">
              {latestNewspaper ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-14 bg-[#18181B] rounded-lg border border-[#FACC15]/40 flex flex-col items-center justify-center shrink-0 text-[#FACC15]">
                      <Newspaper className="w-6 h-6 text-[#FACC15]" />
                      <span className="text-[8px] font-black uppercase text-red-400 mt-0.5">PDF</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1 font-newspaper">
                        {latestNewspaper.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
                        संस्करण तिथि: <strong className="text-[#FACC15]">{latestNewspaper.editionDate}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={latestNewspaper.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#18181B] hover:bg-[#27272A] text-slate-200 hover:text-white text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5 transition border border-[#27272A]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FACC15]" /> ऑनलाइन पढ़ें
                    </a>
                    <button
                      onClick={(e) => handleDownload(e, latestNewspaper)}
                      className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white text-xs font-black py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5 shadow-md transition border border-[#FACC15]/30"
                    >
                      <Download className="w-3.5 h-3.5" /> डाउनलोड PDF
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">नवीनतम ई-पेपर लोड हो रहा है...</p>
              )}
            </div>
          </div>

          {/* Top 4 Trending Headlines (Numbered 01-04) */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex-1">
            <div className="flex items-center justify-between border-b-2 border-[#B71C1C] pb-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#B71C1C]" />
                <span>ट्रेंडिंग ताज़ा खबरें (Top Stories)</span>
              </h3>
              <Link to="/blogs" className="text-[11px] font-bold text-[#B71C1C] hover:text-[#DC2626] flex items-center gap-0.5">
                सभी देखें <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 space-y-2.5 pt-1">
              {sideBlogs.map((b, idx) => (
                <div key={b._id} className="pt-2.5 flex items-start gap-3 group">
                  {/* Number Badge */}
                  <span className="w-6 h-6 rounded-full bg-[#B71C1C] text-[#FACC15] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {`0${idx + 1}`}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                    {b.imageUrl ? (
                      <img src={b.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-bold bg-[#121212] text-[#FACC15]">
                        NEWS
                      </div>
                    )}
                  </div>

                  {/* Title & Date */}
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#B71C1C] transition line-clamp-2 leading-tight">
                      <Link to={`/blogs/${b.slug || b._id}`}>{b.title}</Link>
                    </h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B71C1C]" />
                      {new Date(b.createdAt).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 2. CHIEF EDITOR & FOUNDER SHOWCASE SECTION (High Authority Editorial Card) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm relative overflow-hidden border-t-4 border-t-[#B71C1C]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FACC15]/10 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          
          {/* Founder Photo */}
          <div className="relative shrink-0">
            <img
              src="/profile.jpeg"
              alt="राजू सिंह - मुख्य संपादक एवं संस्थापक"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#B71C1C] ring-4 ring-[#FACC15] shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.jpeg';
              }}
            />
            <div className="absolute bottom-0 right-1 bg-[#B71C1C] text-[#FACC15] p-1.5 rounded-full shadow-md border-2 border-white" title="Chief Editor Verified">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Editorial Content */}
          <div className="space-y-3.5 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#B71C1C] bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#B71C1C]" />
                  संस्थापक एवं मुख्य संपादक (Chief Editor & Founder)
                </div>
                <h3 className="text-2xl sm:text-3.5xl font-black text-slate-900 mt-1.5 font-newspaper">
                  राजू सिंह (Raju Singh)
                </h3>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>सत्य व निडर पत्रकारिता का संकल्प</span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              मगरांचल खोज खबर के मुख्य संपादक <strong>राजू सिंह</strong> के मार्गदर्शन में हमारा पत्रकारिता मंच ग्रामीण, कस्बाई और राष्ट्रीय स्तर पर आम जनता की समस्याओं, विकास के मुद्दों और निष्पक्ष समाचारों को प्राथमिकता से प्रसारित करता है।
            </p>

            {/* Branded Social Buttons */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="text-xs font-bold text-slate-700 mr-1">आधिकारिक सोशल मीडिया:</span>
              <a
                href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#B71C1C] hover:bg-[#DC2626] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <Youtube className="w-3.5 h-3.5 text-[#FACC15]" /> YouTube Channel
              </a>
              <a
                href="https://instagram.com/mangranchal_times__news_1990?psln=MTh3NGFuNGZxa3g3cA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1KEYKSBHBr/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORY FILTERED NEWS GRID SECTION */}
      <section className="space-y-6">
        
        {/* Category Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#B71C1C] pb-3 gap-3">
          <div>
            <span className="text-[10px] font-black text-[#B71C1C] uppercase tracking-widest block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FACC15]" /> समाचार अनुभाग (News Categories)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-newspaper">
              श्रेणी वार मुख्य खबरें (News Feed)
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                  activeCategory === cat
                    ? 'bg-[#B71C1C] text-[#FACC15] border-[#FACC15] shadow-md font-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-[#121212] hover:text-[#FACC15]'
                }`}
              >
                {cat === 'All' ? 'सभी खबरें' : cat === 'Local News' ? 'स्थानीय समाचार' : cat === 'Politics' ? 'राजनीति' : cat === 'Sports' ? 'खेल' : cat === 'Business' ? 'व्यापार' : 'संपादकीय'}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-[#B71C1C] hover:shadow-lg transition duration-300 flex flex-col group"
              >
                {/* Image Box */}
                <div className="h-48 bg-[#0A0A0A] relative overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#121212] text-[#FACC15]">
                      <Newspaper className="w-10 h-10 text-slate-600" />
                    </div>
                  )}

                  {/* Category Pill in Red/Gold */}
                  <span className="absolute top-3 left-3 bg-[#B71C1C] text-[#FACC15] font-black text-[10px] uppercase px-2.5 py-1 rounded shadow-md border border-[#FACC15]/40">
                    {blog.category || 'Local News'}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center text-[11px] text-slate-500 gap-2 mb-2 font-medium">
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
                      className="text-xs font-bold text-[#B71C1C] group-hover:text-[#DC2626] flex items-center gap-1"
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
            <Newspaper className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <p className="text-slate-600 text-sm font-bold">इस श्रेणी में फिलहाल कोई समाचार उपलब्ध नहीं है।</p>
          </div>
        )}
      </section>

      {/* 4. BREAKING UPDATES / COMMUNITY NOTICE BANNER */}
      <section className="bg-gradient-to-r from-[#0A0A0A] via-[#18181B] to-[#0A0A0A] text-white rounded-2xl p-6 border-2 border-[#FACC15] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#B71C1C] text-[#FACC15] rounded-xl shrink-0 shadow-md">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>मगरांचल न्यूज़ नेटवर्क से तुरंत जुड़ें</span>
              <span className="bg-[#B71C1C] text-[#FACC15] text-[9px] uppercase font-black px-2 py-0.5 rounded">OFFICIAL</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              ताज़ा राजनीतिक हलचल, दुर्घटना, अपराध, और स्थानीय विकास की खबरें सीधे अपने फोन पर पाने के लिए हमारे यूट्यूब चैनल को सब्सक्राइब करें।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
            target="_blank"
            rel="noreferrer"
            className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white text-xs font-black px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition"
          >
            <Youtube className="w-4 h-4 text-[#FACC15]" /> YouTube सब्सक्राइब
          </a>
          <Link
            to="/newspapers"
            className="bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black px-4 py-2.5 rounded-lg transition"
          >
            ई-पेपर देखें
          </Link>
        </div>
      </section>

      {/* 5. 30-DAY AUTO DELETE ARCHIVE NOTICE */}
      <section className="bg-[#0A0A0A] text-white rounded-xl p-5 border-l-4 border-l-[#B71C1C] border border-[#27272A] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-[#18181B] text-[#FACC15] rounded-lg shrink-0 border border-[#27272A]">
            <Clock className="w-5 h-5 text-[#FACC15]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              30-दिवसीय स्वचालित निष्कासन नीति (30-Day Auto Archive Policy)
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              मगरांचल खोज खबर पोर्टल पर प्रकाशित समाचार और दैनिक ई-पेपर (PDF) प्रकाशन तिथि के ठीक 30 दिनों बाद आधिकारिक सर्वर से स्वतः हटा दिए जाते हैं।
            </p>
          </div>
        </div>

        <Link
          to="/newspapers"
          className="bg-[#B71C1C] hover:bg-[#DC2626] text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition shrink-0"
        >
          ई-पेपर आर्काइव देखें
        </Link>
      </section>

    </div>
  );
};

export default Home;
