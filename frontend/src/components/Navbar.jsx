import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Newspaper,
  BookOpen,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Calendar,
  Clock,
  Instagram,
  Youtube,
  Facebook,
  Search,
  Sparkles,
  Flame,
  ChevronRight,
  Globe,
  Radio
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeString, setTimeString] = useState('');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setDrawerOpen(false);
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white font-sans shadow-md border-b-2 border-[#B71C1C]">
      
      {/* 1. TOP UTILITY BAR (Deep Black with Gold & Red Accents) */}
      <div className="bg-[#0A0A0A] text-slate-300 py-1.5 px-4 text-xs border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Left: Date, Time & Agency Badge */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
              <span className="text-[11px] sm:text-xs">{currentDate}</span>
            </span>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <span className="hidden sm:flex items-center gap-1 text-[#FACC15] font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{timeString}</span>
            </span>

            <span className="text-slate-600 hidden md:inline">|</span>

            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
              <span className="text-slate-200 font-semibold">मगरांचल</span> राष्ट्रीय व स्थानीय समाचार एजेंसी
            </span>
          </div>

          {/* Right: Social Links & Account State */}
          <div className="flex items-center gap-3">
            {/* Social Icons with brand hover colors */}
            <div className="hidden sm:flex items-center gap-2.5 border-r border-[#27272A] pr-3">
              <a
                href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-[#18181B] flex items-center justify-center text-slate-300 hover:text-[#DC2626] hover:bg-[#27272A] transition"
                title="YouTube"
              >
                <Youtube className="w-3 h-3 text-[#DC2626]" />
              </a>
              <a
                href="https://instagram.com/mangranchal_times__news_1990?psln=MTh3NGFuNGZxa3g3cA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-[#18181B] flex items-center justify-center text-slate-300 hover:text-pink-500 hover:bg-[#27272A] transition"
                title="Instagram"
              >
                <Instagram className="w-3 h-3 text-pink-500" />
              </a>
              <a
                href="https://www.facebook.com/share/1KEYKSBHBr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-[#18181B] flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-[#27272A] transition"
                title="Facebook"
              >
                <Facebook className="w-3 h-3 text-blue-500" />
              </a>
            </div>

            {/* Auth Link / Status */}
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-[#18181B] px-2 py-0.5 rounded-full border border-slate-700">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-4 h-4 rounded-full object-cover border border-[#FACC15]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                  <span className="text-slate-200 font-semibold text-[11px] truncate max-w-[120px]">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="bg-[#B71C1C] text-[#FACC15] border border-[#FACC15]/40 px-1 py-0.1 rounded text-[8px] uppercase font-black ml-0.5 tracking-wider">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="hover:text-[#FACC15] flex items-center gap-1 transition text-slate-400 text-[11px] font-medium"
                  title="लॉगआउट"
                >
                  <LogOut className="w-3 h-3 text-[#DC2626]" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-semibold text-[11px]">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-[#FACC15] transition"
                >
                  लॉगइन
                </Link>
                <span className="text-slate-600">/</span>
                <Link
                  to="/register"
                  className="bg-[#B71C1C] hover:bg-[#DC2626] text-white px-2.5 py-0.5 rounded text-[11px] font-bold transition shadow-sm"
                >
                  साइन अप
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. MAIN NEWSPAPER BRAND MASTHEAD (Crisp White + Crimson Red + Gold Trim) */}
      <div className="py-3 px-4 sm:px-8 bg-white border-b border-[#FACC15]/60 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Logo & Newspaper Branding */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="relative">
              <img
                src="/logo.jpeg"
                alt="मगरांचल खोज खबर"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#B71C1C] ring-2 ring-[#FACC15] object-cover shadow-md group-hover:scale-105 transition duration-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="absolute -bottom-1 -right-1 bg-[#B71C1C] text-[#FACC15] text-[9px] font-extrabold px-1 py-0.2 rounded-full border border-white shadow">
                NEWS
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#B71C1C] leading-none drop-shadow-sm font-newspaper">
                  मगरांचल खोज खबर
                </h1>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#0A0A0A] font-extrabold tracking-widest uppercase mt-1 flex items-center gap-1.5 flex-wrap">
                <span>MAGRANCHAL KHOJ KHABAR</span>
                <span className="text-[#B71C1C] font-black">✦</span>
                <span className="text-slate-600 hidden sm:inline">निष्पक्ष एवं निर्भीक पत्रकारिता</span>
                <span className="text-[#B71C1C] font-black hidden sm:inline">✦</span>
                <span className="text-red-700 font-bold hidden md:inline">दैनिक ई-पेपर</span>
              </p>
            </div>
          </Link>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prominent Golden-Yellow E-Paper Button */}
            <Link
              to="/newspapers"
              className="bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs uppercase tracking-wide shadow-md border border-[#CA8A04] transition hover:scale-[1.02]"
            >
              <Newspaper className="w-4 h-4 text-[#B71C1C]" />
              <span className="hidden sm:inline">आज का ई-पेपर</span>
              <span className="sm:hidden">ई-पेपर</span>
              <span className="bg-[#B71C1C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded ml-0.5">PDF</span>
            </Link>

            {/* Black & Red Hamburger Menu Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="bg-[#0A0A0A] hover:bg-[#18181B] text-white px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition shadow-sm border border-[#27272A] hover:border-[#B71C1C]"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 sm:w-5 h-4 sm:h-5 text-[#FACC15]" />
              <span className="hidden sm:inline">मेनू (Menu)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. PRIMARY CATEGORY NAVIGATION BAR (Sleek Black with Red & Gold Highlights) */}
      <nav className="bg-[#121212] text-white border-t border-[#27272A] shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          <div className="flex items-center space-x-1 text-xs uppercase tracking-wider overflow-x-auto py-0.5 no-scrollbar">
            <Link
              to="/"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 transition whitespace-nowrap border-b-2 font-bold ${
                isActive('/')
                  ? 'border-[#FACC15] text-[#FACC15] bg-[#1C1C1E]'
                  : 'border-transparent text-slate-200 hover:text-[#FACC15] hover:bg-[#18181B]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#B71C1C]" />
              मुख्य पृष्ठ
            </Link>

            <Link
              to="/blogs"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 transition whitespace-nowrap border-b-2 font-bold ${
                isActive('/blogs')
                  ? 'border-[#FACC15] text-[#FACC15] bg-[#1C1C1E]'
                  : 'border-transparent text-slate-200 hover:text-[#FACC15] hover:bg-[#18181B]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#DC2626]" />
              ताज़ा समाचार व ब्लॉग
            </Link>

            <Link
              to="/newspapers"
              className={`px-3.5 py-2.5 flex items-center gap-1.5 transition whitespace-nowrap border-b-2 font-bold ${
                isActive('/newspapers')
                  ? 'border-[#FACC15] text-[#FACC15] bg-[#1C1C1E]'
                  : 'border-transparent text-slate-200 hover:text-[#FACC15] hover:bg-[#18181B]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-[#FACC15]" />
              दैनिक ई-पेपर PDF
            </Link>

            {/* Category Quick Links */}
            <Link
              to="/blogs?category=Politics"
              className="px-3 py-2.5 text-slate-300 hover:text-[#FACC15] hover:bg-[#18181B] transition whitespace-nowrap font-medium hidden sm:inline-flex"
            >
              राजनीति
            </Link>

            <Link
              to="/blogs?category=Local News"
              className="px-3 py-2.5 text-slate-300 hover:text-[#FACC15] hover:bg-[#18181B] transition whitespace-nowrap font-medium hidden sm:inline-flex"
            >
              स्थानीय समाचार
            </Link>

            <Link
              to="/blogs?category=Sports"
              className="px-3 py-2.5 text-slate-300 hover:text-[#FACC15] hover:bg-[#18181B] transition whitespace-nowrap font-medium hidden md:inline-flex"
            >
              खेल
            </Link>

            <Link
              to="/blogs?category=Business"
              className="px-3 py-2.5 text-slate-300 hover:text-[#FACC15] hover:bg-[#18181B] transition whitespace-nowrap font-medium hidden lg:inline-flex"
            >
              व्यापार
            </Link>

            {/* Admin link if user is admin */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2.5 flex items-center gap-1.5 transition whitespace-nowrap bg-[#B71C1C] text-[#FACC15] font-black hover:bg-[#991B1B] border-l border-r border-[#FACC15]/30 ${
                  isActive('/admin') ? 'ring-2 ring-[#FACC15]' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#FACC15]" />
                एडमिन डैशबोर्ड
              </Link>
            )}
          </div>

          {/* Quick Search & Menu Trigger Icon */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-slate-300 hover:text-[#FACC15] hover:bg-[#18181B] rounded transition shrink-0"
              title="सभी श्रेणियां व खोज (Search & Menu)"
            >
              <Search className="w-4 h-4 text-[#FACC15]" />
            </button>
          </div>

        </div>
      </nav>

      {/* 4. RIGHT SIDE SLIDING HAMBURGER DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-80 sm:w-96 bg-[#0A0A0A] text-white shadow-2xl flex flex-col justify-between border-l-2 border-[#B71C1C] overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-[#121212]">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="w-11 h-11 rounded-full border-2 border-[#B71C1C] ring-1 ring-[#FACC15] object-cover"
                  />
                  <div>
                    <h3 className="font-black text-white text-base leading-tight font-newspaper">
                      मगरांचल खोज खबर
                    </h3>
                    <p className="text-[10px] text-[#FACC15] font-extrabold uppercase tracking-wider">
                      NEWS AGENCY & E-PAPER
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#27272A] transition"
                  title="बंद करें"
                >
                  <X className="w-6 h-6 text-[#FACC15]" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-6 flex-1">
                
                {/* User Mobile Status Card */}
                {user ? (
                  <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#FACC15]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#B71C1C] flex items-center justify-center font-bold text-white text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'admin' && (
                            <span className="bg-[#B71C1C] text-[#FACC15] text-[9px] px-1.5 py-0.2 rounded font-black">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setDrawerOpen(false); navigate('/'); }}
                      className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-black/40 rounded-lg transition"
                      title="लॉगआउट"
                    >
                      <LogOut className="w-4 h-4 text-[#DC2626]" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="py-2 text-center rounded-lg border border-[#FACC15]/40 bg-[#18181B] text-slate-200 hover:text-white text-xs font-bold transition"
                    >
                      लॉगइन
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDrawerOpen(false)}
                      className="py-2 text-center rounded-lg bg-[#B71C1C] hover:bg-[#DC2626] text-white text-xs font-bold transition shadow"
                    >
                      साइन अप
                    </Link>
                  </div>
                )}

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="खबर खोजें (Search news)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#18181B] text-white border border-[#27272A] rounded-lg pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none placeholder-slate-400"
                  />
                  <Search className="w-4 h-4 text-[#FACC15] absolute left-3 top-3" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-[#B71C1C] hover:bg-[#DC2626] text-white text-[11px] font-bold px-2.5 py-1 rounded"
                  >
                    खोजें
                  </button>
                </form>

                {/* Primary Navigation Links */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#FACC15] uppercase tracking-widest mb-3 border-b border-[#27272A] pb-1.5 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#B71C1C]" /> मुख्य अनुभाग (Main Sections)
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18181B] text-slate-200 hover:text-[#FACC15] font-semibold transition"
                      >
                        <span>मुख्य पृष्ठ (Home)</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blogs"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18181B] text-slate-200 hover:text-[#FACC15] font-semibold transition"
                      >
                        <span>सभी समाचार व लेख (All Blogs)</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/newspapers"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] hover:bg-[#FACC15]/20 font-bold transition mt-1"
                      >
                        <span className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-[#FACC15]" /> दैनिक ई-पेपर (PDF Download)
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#FACC15]" />
                      </Link>
                    </li>
                    {user && user.role === 'admin' && (
                      <li>
                        <Link
                          to="/admin"
                          onClick={() => setDrawerOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#B71C1C] hover:bg-[#991B1B] text-[#FACC15] font-black transition mt-2 border border-[#FACC15]/30"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-[#FACC15]" /> एडमिन डैशबोर्ड (Admin CMS)
                          </span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                {/* News Categories */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#FACC15] uppercase tracking-widest mb-3 border-b border-[#27272A] pb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#B71C1C]" /> श्रेणियां (Categories)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Local News', 'Politics', 'Sports', 'Business', 'Opinion'].map((cat) => (
                      <Link
                        key={cat}
                        to={`/blogs?category=${cat}`}
                        onClick={() => setDrawerOpen(false)}
                        className="p-2.5 bg-[#18181B] hover:bg-[#27272A] hover:border-[#FACC15] text-slate-200 hover:text-white rounded-lg border border-[#27272A] font-medium transition text-center"
                      >
                        {cat === 'Local News' ? 'स्थानीय समाचार' : cat === 'Politics' ? 'राजनीति' : cat === 'Sports' ? 'खेल समाचार' : cat === 'Business' ? 'व्यापार/अर्थ' : 'विचार/संपादकीय'}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Editorial Info Card inside Drawer */}
                <div className="bg-[#121212] p-4 rounded-xl border border-[#27272A] space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src="/profile.jpeg"
                      alt="Raju Singh"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#B71C1C]"
                      onError={(e) => { e.target.src = '/logo.jpeg'; }}
                    />
                    <div>
                      <h5 className="font-extrabold text-white text-xs">राजू सिंह (Raju Singh)</h5>
                      <p className="text-[10px] text-[#FACC15] font-bold">संस्थापक एवं मुख्य संपादक</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    सत्य, निष्पक्षता और समाज के हर वर्ग की आवाज को बुलंद करने हेतु समर्पित।
                  </p>
                </div>

                {/* Social Links inside Drawer */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    सोशल मीडिया पर फॉलो करें
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#18181B] hover:bg-[#B71C1C] text-white text-center py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition border border-[#27272A]"
                    >
                      <Youtube className="w-4 h-4 text-[#DC2626]" />
                      <span className="text-[10px]">YouTube</span>
                    </a>
                    <a
                      href="https://instagram.com/mangranchal_times__news_1990?psln=MTh3NGFuNGZxa3g3cA%3D%3D"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#18181B] hover:bg-pink-600 text-white text-center py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition border border-[#27272A]"
                    >
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-[10px]">Instagram</span>
                    </a>
                    <a
                      href="https://www.facebook.com/share/1KEYKSBHBr/"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#18181B] hover:bg-blue-600 text-white text-center py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition border border-[#27272A]"
                    >
                      <Facebook className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px]">Facebook</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#121212] border-t border-[#27272A] text-[11px] text-slate-400 text-center flex items-center justify-between">
                <span>© {new Date().getFullYear()} मगरांचल खोज खबर</span>
                <span className="text-[#FACC15] font-bold">RNI REGISTERED</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
