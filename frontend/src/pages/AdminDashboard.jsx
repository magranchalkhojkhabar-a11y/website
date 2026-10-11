import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  ShieldAlert,
  BookOpen,
  Newspaper,
  PlusCircle,
  Trash2,
  Edit,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' | 'newspapers' | 'status'

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Local News',
    author: 'Admin',
    content: ''
  });
  const [blogImage, setBlogImage] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Newspaper Form State
  const [paperForm, setPaperForm] = useState({
    title: `मगरांचल खोज खबर - ${new Date().toLocaleDateString('hi-IN')}`,
    editionDate: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  });
  const [paperPdf, setPaperPdf] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [blogsRes, papersRes] = await Promise.all([
        axios.get('/api/blogs?limit=50'),
        axios.get('/api/newspapers?limit=50')
      ]);
      setBlogs(blogsRes.data.blogs || []);
      setNewspapers(papersRes.data.newspapers || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  // --- BLOG HANDLERS ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      showNotification('error', 'शीर्षक (Title) और सामग्री (Content) आवश्यक हैं।');
      return;
    }

    const formData = new FormData();
    formData.append('title', blogForm.title);
    formData.append('category', blogForm.category);
    formData.append('author', blogForm.author);
    formData.append('content', blogForm.content);
    if (blogImage) {
      formData.append('image', blogImage);
    }

    try {
      setLoading(true);
      if (editingBlogId) {
        await axios.put(`/api/blogs/${editingBlogId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('success', 'ब्लॉग सफलतापूर्वक अपडेट किया गया!');
      } else {
        await axios.post('/api/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('success', 'नया ब्लॉग सफलतापूर्वक प्रकाशित किया गया!');
      }

      setBlogForm({ title: '', category: 'Local News', author: 'Admin', content: '' });
      setBlogImage(null);
      setEditingBlogId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'ब्लॉग सेव करने में त्रुटि।');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title,
      category: blog.category || 'Local News',
      author: blog.author || 'Admin',
      content: blog.content
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस ब्लॉग को हटाना चाहते हैं?')) return;
    try {
      await axios.delete(`/api/blogs/${id}`);
      showNotification('success', 'ब्लॉग सफलतापूर्वक हटा दिया गया।');
      fetchData();
    } catch (err) {
      showNotification('error', 'ब्लॉग हटाने में विफल।');
    }
  };

  // --- NEWSPAPER HANDLERS ---
  const handlePaperSubmit = async (e) => {
    e.preventDefault();
    if (!paperForm.title || !paperForm.editionDate) {
      showNotification('error', 'शीर्षक और संस्करण तिथि भरें।');
      return;
    }

    if (!paperPdf) {
      showNotification('error', 'कृपया समाचार पत्र PDF फाइल चुनें!');
      return;
    }

    const formData = new FormData();
    formData.append('title', paperForm.title);
    formData.append('editionDate', paperForm.editionDate);
    formData.append('pdf', paperPdf);

    try {
      setLoading(true);
      await axios.post('/api/newspapers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showNotification('success', 'नया ई-पेपर (PDF) सफलतापूर्वक अपलोड किया गया!');
      setPaperForm({
        title: `मगरांचल खोज खबर - ${new Date().toLocaleDateString('hi-IN')}`,
        editionDate: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      });
      setPaperPdf(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'PDF अपलोड विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (id) => {
    if (!window.confirm('क्या आप निश्चित रूप से इस ई-पेपर PDF को हटाना चाहते हैं?')) return;
    try {
      await axios.delete(`/api/newspapers/${id}`);
      showNotification('success', 'ई-पेपर सफलतापूर्वक हटा दिया गया।');
      fetchData();
    } catch (err) {
      showNotification('error', 'ई-पेपर हटाने में विफल।');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      
      {/* Admin Top Header in Deep Black + Red + Gold */}
      <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#B71C1C] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACC15]/10 rounded-bl-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B71C1C] via-[#FACC15] to-[#B71C1C]"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-[#B71C1C] text-[#FACC15] rounded-xl shadow-md border border-[#FACC15]/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#B71C1C] text-[#FACC15] font-black text-[10px] uppercase px-2.5 py-0.5 rounded border border-[#FACC15]/40">
                ADMIN CONTROL CMS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 font-newspaper">
              एडमिन प्रबंध पैनल (Newsroom Dashboard)
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              प्रशासक: <span className="text-[#FACC15] font-bold">{user?.name}</span> • मगरांचल खोज खबर पोर्टल नियंत्रण
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#121212] px-4 py-2.5 rounded-xl border border-[#27272A] text-center min-w-[90px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">कुल ब्लॉग</span>
            <span className="text-lg font-black text-[#FACC15]">{blogs.length}</span>
          </div>
          <div className="bg-[#121212] px-4 py-2.5 rounded-xl border border-[#27272A] text-center min-w-[90px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">ई-पेपर PDF</span>
            <span className="text-lg font-black text-[#FACC15]">{newspapers.length}</span>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {msg.text && (
        <div
          className={`p-4 rounded-xl border-2 flex items-center justify-between text-xs font-bold shadow-md ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
              : 'bg-red-50 border-[#B71C1C] text-red-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {msg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-[#B71C1C]" />}
            <span>{msg.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border-2 border-slate-200 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('blogs')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition border ${
            activeTab === 'blogs'
              ? 'bg-[#B71C1C] text-[#FACC15] border-[#FACC15] shadow-md'
              : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> समाचार व ब्लॉग प्रबंध (Blogs)
        </button>

        <button
          onClick={() => setActiveTab('newspapers')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition border ${
            activeTab === 'newspapers'
              ? 'bg-[#B71C1C] text-[#FACC15] border-[#FACC15] shadow-md'
              : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" /> ई-पेपर PDF अपलोड (E-Paper)
        </button>

        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition border ${
            activeTab === 'status'
              ? 'bg-[#0A0A0A] text-[#FACC15] border-[#FACC15] shadow-md'
              : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-[#FACC15]" /> 30-दिवसीय ऑटो-डिलीट सिस्टम
        </button>
      </div>

      {/* TAB 1: BLOG MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          
          {/* Create / Edit Blog Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-newspaper">
                <PlusCircle className="w-5 h-5 text-[#B71C1C]" />
                {editingBlogId ? 'समाचार संपादित करें (Edit News)' : 'नया समाचार / ब्लॉग जोड़ें (Create News)'}
              </h2>
              {editingBlogId && (
                <button
                  onClick={() => {
                    setEditingBlogId(null);
                    setBlogForm({ title: '', category: 'Local News', author: 'Admin', content: '' });
                  }}
                  className="text-xs text-[#B71C1C] font-bold underline"
                >
                  संपादन रद्द करें (Cancel)
                </button>
              )}
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">समाचार का मुख्य शीर्षक (Title) *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="उदा. मगरांचल में विकास योजनाओं का मुख्य संपादक राजू सिंह ने लिया जायजा"
                    className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">श्रेणी (Category)</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none bg-white font-medium"
                  >
                    <option value="Local News">स्थानीय समाचार (Local News)</option>
                    <option value="Politics">राजनीति (Politics)</option>
                    <option value="Sports">खेल कूद (Sports)</option>
                    <option value="Business">व्यापार (Business)</option>
                    <option value="Opinion">विचार/संपादकीय (Opinion)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">लेखक / रिपोर्टर का नाम (Author)</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ब्लॉग थंबनेल चित्र (Select Image File)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBlogImage(e.target.files[0])}
                    className="w-full p-2 border-2 border-slate-300 rounded-lg text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">समाचार का विस्तृत विवरण (Content) *</label>
                <textarea
                  required
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="समाचार का सम्पूर्ण विवरण यहाँ दर्ज करें..."
                  className="w-full p-3 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 border border-[#FACC15]/40"
              >
                {loading ? 'प्रक्रिया जारी है...' : (editingBlogId ? 'अपडेट समाचार' : 'प्रकाशित करें (Publish News)')}
              </button>
            </form>
          </div>

          {/* Blogs Table */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 overflow-hidden">
            <div className="p-4 bg-[#0A0A0A] text-white flex justify-between items-center border-b-2 border-[#B71C1C]">
              <h3 className="font-black text-sm text-white font-newspaper">मौजूदा समाचार सूची ({blogs.length})</h3>
              <span className="text-[11px] text-[#FACC15] font-bold">30 दिन बाद स्वतः निष्कासित</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 uppercase font-bold">
                    <th className="p-3">थंबनेल</th>
                    <th className="p-3">शीर्षक</th>
                    <th className="p-3">श्रेणी</th>
                    <th className="p-3">तिथि</th>
                    <th className="p-3">व्यूज़</th>
                    <th className="p-3 text-right">कार्रवाई (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {blogs.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        {b.imageUrl ? (
                          <img src={b.imageUrl} alt="" className="w-10 h-10 object-cover rounded border" />
                        ) : (
                          <div className="w-10 h-10 bg-[#121212] rounded flex items-center justify-center text-[#FACC15] font-bold text-[9px]">
                            NEWS
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{b.title}</td>
                      <td className="p-3">
                        <span className="bg-[#B71C1C]/10 text-[#B71C1C] border border-[#B71C1C]/30 font-bold px-2 py-0.5 rounded text-[10px]">
                          {b.category || 'Local News'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(b.createdAt).toLocaleDateString('hi-IN')}</td>
                      <td className="p-3 font-semibold text-slate-700">{b.views || 0}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditBlog(b)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-1.5 rounded transition"
                          title="संपादित करें"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b._id)}
                          className="bg-red-50 hover:bg-red-100 text-[#B71C1C] p-1.5 rounded transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                        कोई समाचार उपलब्ध नहीं है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: NEWSPAPER PDF MANAGEMENT */}
      {activeTab === 'newspapers' && (
        <div className="space-y-6">
          
          {/* Upload Newspaper Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-slate-200 space-y-5">
            <div className="border-b-2 border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-newspaper">
                <Upload className="w-5 h-5 text-[#B71C1C]" />
                नया समाचार पत्र (PDF) अपलोड करें
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                पीडीएफ Cloudinary मीडिया रिपॉजिटरी में सुरक्षित रूप से स्टोर होगी और 30 दिनों बाद स्वतः हट जाएगी।
              </p>
            </div>

            <form onSubmit={handlePaperSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">ई-पेपर का शीर्षक (Title) *</label>
                  <input
                    type="text"
                    required
                    value={paperForm.title}
                    onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                    className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">संस्करण तिथि (Edition Date) *</label>
                  <input
                    type="text"
                    required
                    value={paperForm.editionDate}
                    onChange={(e) => setPaperForm({ ...paperForm, editionDate: e.target.value })}
                    placeholder="उदा. 11 अक्टूबर 2026"
                    className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  समाचार पत्र PDF फाइल (Select PDF File) *
                </label>
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  onChange={(e) => setPaperPdf(e.target.files[0])}
                  className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-xs bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 border border-[#FACC15]/40"
              >
                {loading ? 'अपलोड हो रहा है...' : 'ई-पेपर PDF अपलोड करें'}
              </button>
            </form>
          </div>

          {/* Newspapers Table */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 overflow-hidden">
            <div className="p-4 bg-[#0A0A0A] text-white flex justify-between items-center border-b-2 border-[#B71C1C]">
              <h3 className="font-black text-sm text-white font-newspaper">अपलोड किए गए ई-पेपर संस्करण ({newspapers.length})</h3>
              <span className="text-[11px] text-[#FACC15] font-bold">30 दिन बाद स्वतः निष्कासित</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 uppercase font-bold">
                    <th className="p-3">शीर्षक</th>
                    <th className="p-3">संस्करण तिथि</th>
                    <th className="p-3">अपलोड तिथि</th>
                    <th className="p-3">डाउनलोड संख्या</th>
                    <th className="p-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {newspapers.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#B71C1C] shrink-0" />
                        <span>{p.title}</span>
                      </td>
                      <td className="p-3 text-slate-700 font-semibold">{p.editionDate}</td>
                      <td className="p-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString('hi-IN')}</td>
                      <td className="p-3 font-bold text-[#B71C1C]">{p.downloadsCount || 0}</td>
                      <td className="p-3 text-right space-x-2">
                        <a
                          href={p.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block bg-[#0A0A0A] hover:bg-[#18181B] text-[#FACC15] px-3 py-1 rounded text-[11px] font-bold transition border border-[#27272A]"
                        >
                          देखें PDF
                        </a>
                        <button
                          onClick={() => handleDeletePaper(p._id)}
                          className="bg-red-50 hover:bg-red-100 text-[#B71C1C] p-1.5 rounded transition"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newspapers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">
                        कोई ई-पेपर संस्करण उपलब्ध नहीं है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: AUTO DELETE & SYSTEM STATUS */}
      {activeTab === 'status' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-slate-200 space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
            <Clock className="w-7 h-7 text-[#B71C1C]" />
            <div>
              <h2 className="text-lg font-black text-slate-900 font-newspaper">
                30-दिवसीय ऑटो-डिलीट नियम विवरण (MongoDB TTL Configuration)
              </h2>
              <p className="text-xs text-slate-500">
                सभी ब्लॉग और ई-पेपर रिकॉर्ड्स में Mongo Mongoose Schema level expire index लागू है।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] text-white border-l-4 border-[#FACC15] p-5 rounded-r-xl space-y-2">
              <h3 className="font-bold text-xs text-[#FACC15] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> MongoDB TTL Index (2,592,000s)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                MongoDB डेटाबेस प्रत्येक ब्लॉग और समाचार पत्र के <code className="bg-[#18181B] text-[#FACC15] px-1 rounded">createdAt</code> फ़ील्ड पर 30 दिन (30 x 24 x 3600 सेकंड) का इंडेक्स बनाए रखता है। 30 दिन पूरे होने पर Mongo BG TTL Thread स्वतः डेटा हटा देता है।
              </p>
            </div>

            <div className="bg-[#0A0A0A] text-white border-l-4 border-[#B71C1C] p-5 rounded-r-xl space-y-2">
              <h3 className="font-bold text-xs text-[#DC2626] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FACC15]" /> Cloudinary Media Assets Cleanup
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                जब भी एडमिन पैनल से कोई ब्लॉग या पीडीएफ मैन्युअल रूप से हटाई जाती है, तो सर्वर Cloudinary APIs कॉल करके मीडिया एसेट को क्लाउड से भी तुरंत हटा देता है।
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
