import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Newspaper, Download, Eye, Calendar, FileText, X, Clock, ShieldCheck, Sparkles } from 'lucide-react';

const Newspapers = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const fetchNewspapers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/newspapers');
      setNewspapers(res.data.newspapers || []);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const handleDownload = async (paper) => {
    try {
      await api.post(`/api/newspapers/${paper._id}/download`);
      window.open(paper.pdfUrl, '_blank');
    } catch (error) {
      window.open(paper.pdfUrl, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Header Banner (Black, Red & Gold) */}
      <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#B71C1C] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACC15]/10 rounded-bl-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B71C1C] via-[#FACC15] to-[#B71C1C]"></div>

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#B71C1C] text-[#FACC15] border border-[#FACC15]/40 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5 text-[#FACC15]" /> मगरांचल डिजिटल ई-पेपर आर्काइव
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-newspaper">
            दैनिक समाचार पत्र (Daily Newspaper PDFs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            यहाँ से आप मगरांचल खोज खबर के सभी दैनिक संस्करणों को उच्च गुणवत्ता में ऑनलाइन पढ़ सकते हैं और आधिकारिक PDF डाउनलोड कर सकते हैं।
          </p>
        </div>

        <div className="bg-[#121212] p-4 rounded-xl border border-[#FACC15]/40 text-xs text-slate-300 space-y-1 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5 font-black text-[#FACC15]">
            <Clock className="w-4 h-4 text-[#FACC15]" /> 30-दिवसीय उपलब्धता
          </div>
          <p className="text-slate-400 text-[11px] max-w-xs">
            प्रत्येक ई-पेपर संस्करण प्रकाशन तिथि से 30 दिनों तक निःशुल्क पढ़ने व डाउनलोड करने के लिए उपलब्ध रहता है।
          </p>
        </div>
      </div>

      {/* Grid of Newspaper Editions */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : newspapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newspapers.map((paper) => (
            <div
              key={paper._id}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-[#B71C1C] hover:shadow-lg transition duration-300 flex flex-col justify-between group"
            >
              {/* Card top in Sleek Black */}
              <div className="bg-[#0A0A0A] p-5 text-white border-b-2 border-[#B71C1C] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#B71C1C] text-[#FACC15] text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-[#FACC15]/40">
                    PDF EDITION
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                    <Download className="w-3.5 h-3.5 text-[#FACC15]" /> {paper.downloadsCount || 0} डाउनलोड
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-[#18181B] text-[#FACC15] border border-[#FACC15]/30 rounded-lg shrink-0">
                    <FileText className="w-6 h-6 text-[#FACC15]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white line-clamp-1 font-newspaper group-hover:text-yellow-300 transition">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B71C1C]" />
                      संस्करण तिथि: <span className="font-bold text-[#FACC15]">{paper.editionDate}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Middle info */}
              <div className="p-4 bg-slate-50 text-xs text-slate-700 space-y-1.5">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">प्रकाशन तिथि:</span>
                  <span className="font-bold text-slate-900">{new Date(paper.createdAt).toLocaleDateString('hi-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">फाइल प्रारूप:</span>
                  <span className="font-bold text-slate-900">{paper.fileSize || 'Standard Print PDF'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedPdf(paper)}
                  className="bg-[#121212] hover:bg-[#27272A] text-[#FACC15] text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition border border-[#27272A]"
                >
                  <Eye className="w-4 h-4 text-[#FACC15]" /> ऑनलाइन पढ़ें
                </button>
                <button
                  onClick={() => handleDownload(paper)}
                  className="bg-[#B71C1C] hover:bg-[#DC2626] text-white text-xs font-black py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition border border-[#B71C1C]"
                >
                  <Download className="w-4 h-4 text-[#FACC15]" /> डाउनलोड PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl text-center border-2 border-slate-200">
          <Newspaper className="w-14 h-14 mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-black text-slate-800 font-newspaper">कोई ई-पेपर संस्करण उपलब्ध नहीं है</h3>
          <p className="text-xs text-slate-500 mt-1">
            संपादकीय डेस्क द्वारा नया दैनिक ई-पेपर PDF अपलोड किए जाने पर यहाँ प्रदर्शित होगा।
          </p>
        </div>
      )}

      {/* Responsive PDF Modal Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sans">
          <div className="bg-[#0A0A0A] w-full max-w-5xl h-[92vh] rounded-2xl border-2 border-[#B71C1C] shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#121212] p-4 border-b border-[#27272A] flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#B71C1C] text-[#FACC15] rounded-lg">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm sm:text-base font-newspaper">{selectedPdf.title}</h3>
                  <p className="text-xs text-[#FACC15] font-bold">संस्करण: {selectedPdf.editionDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleDownload(selectedPdf)}
                  className="bg-[#B71C1C] hover:bg-[#DC2626] text-white text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-4 h-4 text-[#FACC15]" /> PDF डाउनलोड
                </button>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 bg-[#18181B] hover:bg-[#27272A] rounded-lg text-slate-400 hover:text-white transition"
                  title="बंद करें"
                >
                  <X className="w-6 h-6 text-[#FACC15]" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF iframe */}
            <div className="flex-1 bg-[#18181B] relative">
              <iframe
                src={selectedPdf.pdfUrl}
                title={selectedPdf.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Newspapers;
