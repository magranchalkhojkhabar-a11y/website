import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Shield, Instagram, Youtube, Facebook, ChevronRight, Award, Radio } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-slate-300 font-sans mt-16 text-xs border-t-4 border-[#B71C1C]">
      {/* Golden accent stripe */}
      <div className="h-1 bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About Agency */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="मगरांचल खोज खबर"
              className="w-12 h-12 rounded-full border-2 border-[#FACC15] ring-2 ring-[#B71C1C] object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h3 className="text-lg font-black text-white leading-tight font-newspaper">
                मगरांचल खोज खबर
              </h3>
              <p className="text-[10px] text-[#FACC15] uppercase tracking-wider font-extrabold">
                MAGRANCHAL KHOJ KHABAR
              </p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-xs">
            आपका अपना प्रामाणिक, विश्वसनीय हिंदी समाचार पत्र और ई-पेपर पोर्टल। मुख्य संपादक <strong className="text-[#FACC15]">राजू सिंह</strong> के नेतृत्व में जनसरोकार, निष्पक्षता और तेज गति से समाचार सेवा।
          </p>

          {/* Social Icons */}
          <div className="pt-2 flex items-center gap-2.5">
            <a
              href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#18181B] hover:bg-[#B71C1C] text-white flex items-center justify-center transition border border-[#27272A] hover:border-[#DC2626]"
              title="YouTube"
            >
              <Youtube className="w-4 h-4 text-[#DC2626]" />
            </a>
            <a
              href="https://instagram.com/mangranchal_times__news_1990?psln=MTh3NGFuNGZxa3g3cA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#18181B] hover:bg-pink-600 text-white flex items-center justify-center transition border border-[#27272A] hover:border-pink-500"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
            </a>
            <a
              href="https://www.facebook.com/share/1KEYKSBHBr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#18181B] hover:bg-blue-600 text-white flex items-center justify-center transition border border-[#27272A] hover:border-blue-500"
              title="Facebook"
            >
              <Facebook className="w-4 h-4 text-blue-500" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-sm font-black text-white border-b-2 border-[#B71C1C] pb-2 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FACC15] inline-block"></span>
            मुख्य अनुभाग (Navigation)
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="text-slate-400 hover:text-[#FACC15] transition flex items-center gap-1.5 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-[#B71C1C]" /> मुख्य पृष्ठ (Home)
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="text-slate-400 hover:text-[#FACC15] transition flex items-center gap-1.5 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-[#B71C1C]" /> ताज़ा समाचार व ब्लॉग
              </Link>
            </li>
            <li>
              <Link to="/newspapers" className="text-[#FACC15] hover:underline transition flex items-center gap-1.5 font-bold">
                <ChevronRight className="w-3.5 h-3.5 text-[#FACC15]" /> आज का दैनिक ई-पेपर PDF
              </Link>
            </li>
            <li>
              <Link to="/blogs?category=Politics" className="text-slate-400 hover:text-[#FACC15] transition flex items-center gap-1.5 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-[#B71C1C]" /> राजनीति (Politics)
              </Link>
            </li>
            <li>
              <Link to="/blogs?category=Local News" className="text-slate-400 hover:text-[#FACC15] transition flex items-center gap-1.5 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-[#B71C1C]" /> स्थानीय व ग्रामीण खबरें
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-slate-400 hover:text-[#FACC15] transition flex items-center gap-1.5 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-[#B71C1C]" /> पाठक / एडमिन लॉगइन
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Editorial & Founder Showcase */}
        <div>
          <h4 className="text-sm font-black text-white border-b-2 border-[#B71C1C] pb-2 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FACC15] inline-block"></span>
            संपादकीय डेस्क
          </h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="bg-[#121212] p-3 rounded-lg border border-[#27272A]">
              <p className="text-white font-extrabold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#FACC15]" />
                मुख्य संपादक: राजू सिंह
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                मगरांचल क्षेत्र में पत्रकारिता एवं जनसरोकार हेतु समर्पित।
              </p>
            </div>

            <p className="text-[11px] text-slate-300 font-semibold pt-1">
              आधिकारिक चैनलों से तुरंत जुड़ें:
            </p>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://youtube.com/@rajuchouhan-cq5th?si=9IOV9ChBj89BsS1O"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-[#FACC15] flex items-center gap-1.5 font-medium"
                >
                  <Youtube className="w-3.5 h-3.5" /> Raju Chouhan YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/mangranchal_times__news_1990?psln=MTh3NGFuNGZxa3g3cA%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:text-[#FACC15] flex items-center gap-1.5 font-medium"
                >
                  <Instagram className="w-3.5 h-3.5" /> @mangranchal_times__news_1990
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1KEYKSBHBr/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-[#FACC15] flex items-center gap-1.5 font-medium"
                >
                  <Facebook className="w-3.5 h-3.5" /> Magranchal Facebook Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Col 4: Contact & Policy */}
        <div>
          <h4 className="text-sm font-black text-white border-b-2 border-[#B71C1C] pb-2 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#FACC15] inline-block"></span>
            संपर्क व कार्यालय
          </h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <span>प्रधान कार्यालय, मगरांचल प्रेस भवन, मुख्य चौक</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FACC15] shrink-0" />
              <span>contact@magranchalkhojkhabar.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span className="text-white font-bold">+91 98765 43210</span>
            </div>

            {/* Auto Delete Policy Callout in Red/Gold */}
            <div className="mt-3.5 p-2.5 bg-[#18181B] rounded-lg border border-[#FACC15]/30 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#FACC15]">
                <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                30-दिवसीय स्वचालित आर्काइव नीति
              </div>
              <p className="text-slate-400 text-[10px] leading-tight">
                सभी डिजिटल समाचार और PDF संस्करण प्रकाशन तिथि से 30 दिनों बाद स्वतः हटा दिए जाते हैं।
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar (Deep Black with Gold Accent) */}
      <div className="bg-[#050505] py-3.5 px-4 text-center text-xs text-slate-500 border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <span className="text-[#FACC15] font-bold">मगरांचल खोज खबर (Magranchal Khoj Khabar)</span>. सर्वाधिकार सुरक्षित।
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>निडर एवं निष्पक्ष क्षेत्रीय पत्रकारिता पोर्टल</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
