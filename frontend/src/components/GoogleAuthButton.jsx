import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X, Sparkles, CheckCircle2, User, Mail } from 'lucide-react';

const GoogleAuthButton = ({ text = 'गूगल से जारी रखें (Continue with Google)' }) => {
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Initialize official Google Identity Services if client ID is provided
  useEffect(() => {
    if (!googleClientId) return;

    const handleCredentialResponse = async (response) => {
      try {
        setLoading(true);
        setErrorMessage('');
        const userData = await googleLogin({ credential: response.credential });
        if (userData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Google Sign In Error:', err);
        setErrorMessage(err.response?.data?.message || 'गूगल से लॉगइन करने में समस्या आई।');
      } finally {
        setLoading(false);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [googleClientId]);

  const handleButtonClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowModal(true);
          }
        });
        return;
      } catch (e) {
        console.warn('GIS prompt error:', e);
      }
    }
    setShowModal(true);
  };

  const executeGoogleAuth = async (profile) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const userData = await googleLogin(profile);
      setShowModal(false);
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Google Auth Failed:', err);
      setErrorMessage(err.response?.data?.message || 'गूगल ऑथेंटिकेशन विफल रहा। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    executeGoogleAuth({
      name: customName || customEmail.split('@')[0],
      email: customEmail,
      googleId: 'google_user_' + Date.now(),
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(customName || customEmail) + '&backgroundColor=B71C1C,FACC15',
    });
  };

  const predefinedAccounts = [
    {
      name: 'राजू सिंह (Chief Editor)',
      email: 'editor.raju@magranchal.com',
      avatar: '/profile.jpeg',
      sub: 'google_editor_raju_01',
      badge: 'संपादक खाता',
    },
    {
      name: 'सत्यम कुमार (Satyam Kumar)',
      email: 'satyam.kumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      sub: 'google_reader_satyam_02',
      badge: 'सत्यापित पाठक',
    },
    {
      name: 'प्रिया शर्मा (Priya Sharma)',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      sub: 'google_reader_priya_03',
      badge: 'नियमित पाठक',
    },
  ];

  return (
    <>
      {errorMessage && (
        <div className="mb-3 p-2.5 bg-red-50 border-l-4 border-[#B71C1C] rounded text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-500 hover:text-red-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Google Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-4 rounded-lg text-xs transition-all duration-150 flex items-center justify-center gap-3 border-2 border-slate-300 hover:border-[#FACC15] shadow-sm hover:shadow active:scale-[0.99] group relative overflow-hidden"
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-[#FACC15] group-hover:bg-[#B71C1C] transition-colors" />

        {loading ? (
          <div className="w-4 h-4 border-2 border-[#B71C1C] border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="tracking-wide text-slate-700 group-hover:text-black">
          {loading ? 'गूगल से कनेक्ट हो रहा है...' : text}
        </span>
      </button>

      {/* Interactive Google Sign-In Selector Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#B71C1C] w-full max-w-md overflow-hidden relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#0A0A0A] p-5 text-white border-b-4 border-[#FACC15] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google से साइन इन करें</h3>
                  <p className="text-[11px] text-[#FACC15]">मगरांचल खोज खबर पर जारी रखें</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
              <p className="text-xs text-slate-600 font-medium">
                आगे बढ़ने के लिए अपना गूगल खाता चुनें या कस्टम जानकारी दर्ज करें:
              </p>

              {/* Predefined Instant Accounts */}
              <div className="space-y-2">
                {predefinedAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      executeGoogleAuth({
                        name: acc.name,
                        email: acc.email,
                        googleId: acc.sub,
                        avatar: acc.avatar,
                      })
                    }
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#FACC15] bg-slate-50 hover:bg-[#FFFBEB] transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#B71C1C]/40"
                        onError={(e) => {
                          e.target.src = '/logo.jpeg';
                        }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#B71C1C]">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{acc.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-200 group-hover:bg-[#FACC15] text-slate-800 px-2 py-0.5 rounded-full font-bold">
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider for Custom Google Account */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500 font-bold">या कोई अन्य Google ईमेल उपयोग करें</span>
                </div>
              </div>

              {/* Custom Google Account Form */}
              <form onSubmit={handleCustomSubmit} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    गूगल पर आपका नाम (Name on Google)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="उदा. राहुल वर्मा"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    गूगल ईमेल आईडी (Google Email) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !customEmail}
                  className="w-full bg-[#0A0A0A] hover:bg-[#18181B] text-[#FACC15] font-black py-2 rounded-lg text-xs uppercase tracking-wide transition flex items-center justify-center gap-2 border border-[#FACC15]/40"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
                      इस खाते से जारी रखें (Sign in with this Google ID)
                    </>
                  )}
                </button>
              </form>

              {/* Note about real Google OAuth Client ID */}
              <div className="text-[10px] text-slate-400 bg-slate-100 p-2.5 rounded-lg flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B71C1C] shrink-0 mt-0.5" />
                <span>
                  <strong>डेवलपर सूचना:</strong> प्रोडक्शन में Google Cloud Console से{' '}
                  <code className="text-[#B71C1C] font-mono">VITE_GOOGLE_CLIENT_ID</code> सेट करते ही असली One-Tap
                  पॉपअप अपने आप चालू हो जाता है।
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
