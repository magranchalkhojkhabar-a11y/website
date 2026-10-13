import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Lock, Mail, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'लॉगइन विफल। कृपया ईमेल और पासवर्ड की जांच करें।');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@magranchal.com');
    setPassword('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-[#B71C1C] overflow-hidden">
        
        {/* Top Header in Deep Black with Gold & Red Accent */}
        <div className="bg-[#0A0A0A] text-white p-6 text-center border-b-4 border-[#FACC15] relative">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="w-16 h-16 rounded-full mx-auto border-2 border-[#FACC15] ring-2 ring-[#B71C1C] mb-2.5 object-cover shadow-md"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h2 className="text-2xl font-black text-white font-newspaper">मगरांचल खोज खबर</h2>
          <p className="text-[11px] text-[#FACC15] uppercase tracking-wider font-extrabold mt-0.5">
            खाता लॉगइन (User / Admin Login)
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-[#B71C1C] p-3 text-xs text-red-700 flex items-center gap-2 rounded shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B71C1C]" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">ईमेल आईडी (Email)</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full pl-9 pr-3 py-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">पासवर्ड (Password)</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border-2 border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#FACC15] focus:border-[#B71C1C] focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B71C1C] hover:bg-[#DC2626] text-[#FACC15] hover:text-white font-black py-3 rounded-lg text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 border border-[#FACC15]/40"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> लॉगइन करें (Login)
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-slate-500 font-extrabold tracking-wider">
                या (OR)
              </span>
            </div>
          </div>

          {/* Continue with Google Button */}
          <GoogleAuthButton text="गूगल से लॉगइन करें (Continue with Google)" />

          {/* Quick Demo Fill Option for Testing */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">त्वरित एडमिन परीक्षण:</span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-black px-3 py-1.5 rounded-lg text-[11px] shadow transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B71C1C]" /> Admin भरना
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-slate-600">
            नया खाता बनाना चाहते हैं?{' '}
            <Link to="/register" className="text-[#B71C1C] font-black hover:underline">
              यहाँ साइन अप करें
            </Link>
          </div>

          <div className="text-center pt-1">
            <Link to="/" className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> मुख्य पृष्ठ पर वापस जाएं
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;
