import React from 'react';
import { BellRing, Zap } from 'lucide-react';

const NewsTicker = ({ headlines = [] }) => {
  const defaultHeadlines = [
    "मगरांचल खोज खबर - राष्ट्रीय व स्थानीय निष्पक्ष समाचार एवं दैनिक डिजिटल ई-पेपर पोर्टल",
    "आज का ई-पेपर PDF संस्करण ऑनलाइन पढ़ने व डाउनलोड करने के लिए उपलब्ध है",
    "मुख्य संपादक राजू सिंह के नेतृत्व में विशेष ग्राउंड रिपोर्ट्स व जनसरोकार की खबरें",
    "सभी प्रकाशित समाचार एवं PDF 30 दिनों के लिए आधिकारिक आर्काइव में उपलब्ध",
    "Magranchal Khoj Khabar - सत्य, निष्पक्षता और तेज गति से समाचार सेवा"
  ];

  const items = headlines.length > 0 ? headlines : defaultHeadlines;
  // Duplicate for seamless infinite marquee loop
  const displayItems = [...items, ...items];

  return (
    <div className="bg-[#0A0A0A] text-white border-y border-[#B71C1C] overflow-hidden flex items-stretch shadow-md select-none font-sans text-xs">
      {/* Breaking News Label */}
      <div className="bg-[#B71C1C] text-white px-3 sm:px-4 py-2 flex items-center gap-2 font-black uppercase tracking-wider whitespace-nowrap shrink-0 shadow-sm border-r-2 border-[#FACC15] relative z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FACC15]"></span>
        </span>
        <Zap className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
        <span className="text-[11px] sm:text-xs tracking-wide">ब्रेकिंग न्यूज़</span>
      </div>

      {/* Marquee Content */}
      <div className="overflow-hidden relative w-full flex items-center py-2 bg-gradient-to-r from-[#121212] via-[#0A0A0A] to-[#121212]">
        <div className="animate-marquee hover:[animation-play-state:paused] flex items-center whitespace-nowrap">
          {displayItems.map((headline, idx) => (
            <span key={idx} className="mx-6 inline-flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition">
              <span className="text-[#FACC15] font-black text-sm">✦</span>
              <span className="font-medium tracking-wide">{headline}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Indicator Accent */}
      <div className="hidden md:flex items-center bg-[#121212] px-3 border-l border-[#27272A] shrink-0 text-[#FACC15] text-[10px] font-bold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5"></span>
        LIVE FEED
      </div>
    </div>
  );
};

export default NewsTicker;
