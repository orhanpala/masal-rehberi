'use client';

import { useState, useEffect, useRef } from 'react';
import { artifacts } from '../data/artifacts';

export default function MasalRehberi() {
  const [lang, setLang] = useState('tr');
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('home'); // 'home' veya 'detail'
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [showQrLangModal, setShowQrLangModal] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('prefLang');
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (idParam) {
      const found = artifacts.find(a => a.id == idParam);
      if (found) {
        setActiveArtifact(found);
        setView('detail');
        if (!savedLang) {
          setShowQrLangModal(true);
        } else {
          setLang(savedLang);
        }
      }
    } else {
      if (savedLang) setLang(savedLang);
    }
  }, []);

  const handleSetLang = (l) => {
    setLang(l);
    localStorage.setItem('prefLang', l);
    setShowQrLangModal(false);
  };

  const openDetail = (id) => {
    window.history.pushState({}, '', `?id=${id}`);
    const found = artifacts.find(a => a.id == id);
    setActiveArtifact(found);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const closeDetail = () => {
    window.history.pushState({}, '', '?');
    setActiveArtifact(null);
    setView('home');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!mounted) return null;

  // QR İlk Giriş Dil Seçim Ekranı
  if (showQrLangModal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#c8aa64] mx-auto mb-8"></div>
        <h1 className="text-5xl font-display font-light text-[#f0e8d8] mb-8 leading-tight">Tunceli<br/><em className="text-[#e8d090] italic">Müzesi</em></h1>
        <p className="text-[0.65rem] text-[#c8aa64] mb-10 tracking-[0.35em] uppercase">Lütfen Dil Seçiniz / Please Select Language</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => handleSetLang('tr')} className="px-10 py-3 border border-[#c8aa64] text-[#c8aa64] hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all uppercase tracking-[0.2em] text-xs">Türkçe</button>
          <button onClick={() => handleSetLang('en')} className="px-10 py-3 border border-[#c8aa64] text-[#c8aa64] hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all uppercase tracking-[0.2em] text-xs">English</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* İYİLEŞTİRME 1: SAĞ ÜSTTEKİ BELİRGİN VE BÜYÜK DİL BUTONU */}
      <div className="fixed top-6 right-6 z-50 flex border border-[#c8aa64] bg-[#0d0b08]/90 backdrop-blur-md shadow-lg shadow-[#c8aa64]/5">
        <button onClick={() => handleSetLang('tr')} className={`px-5 py-2.5 text-xs tracking-[0.15em] transition-all ${lang === 'tr' ? 'bg-[#c8aa64] text-[#0d0b08] font-bold' : 'text-[#c8aa64] hover:bg-[#c8aa64]/10'}`}>TR</button>
        <button onClick={() => handleSetLang('en')} className={`px-5 py-2.5 text-xs tracking-[0.15em] transition-all ${lang === 'en' ? 'bg-[#c8aa64] text-[#0d0b08] font-bold' : 'text-[#c8aa64] hover:bg-[#c8aa64]/10'}`}>EN</button>
      </div>

      {/* DETAY SAYFASI (ESER GÖRÜNÜMÜ) */}
      {view === 'detail' && activeArtifact && (
        <div className="min-h-screen w-full max-w-3xl mx-auto relative animate-in fade-in duration-500 bg-[#0d0b08]">
          <button onClick={closeDetail} className="fixed top-6 left-6 w-11 h-11 border border-[#c8aa64] bg-[#16130e] text-[#c8aa64] flex items-center justify-center text-xl z-50 transition-colors hover:bg-[#c8aa64] hover:text-[#0d0b08] shadow-lg">←</button>
          
          <div className="pt-28 pb-10 px-8 border-b border-[rgba(200,170,100,0.18)] text-center">
            <div className="text-[0.65rem] tracking-[0.35em] text-[#c8aa64] uppercase mb-5">{lang === 'tr' ? activeArtifact.era_tr : activeArtifact.era_en}</div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#f0e8d8] mb-3">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</h2>
            <div className="font-display italic text-xl text-[#9a8e7a]">{lang === 'tr' ? activeArtifact.name_en : activeArtifact.name_tr}</div>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-base md:text-lg leading-loose text-[#f0e8d8] mb-14 font-display font-light tracking-wide">{lang === 'tr' ? activeArtifact.desc_tr : activeArtifact.desc_en}</p>
            
            <div className="mt-8">
              <div className="text-[0.6rem] tracking-[0.35em] text-[#c8aa64] uppercase mb-4">{lang === 'tr' ? 'SESLİ TANITIM' : 'AUDIO GUIDE'}</div>
              <div className="flex items-center gap-5 p-6 border border-[rgba(200,170,100,0.18)] bg-[#16130e] shadow-inner">
                <button onClick={toggleAudio} className="w-14 h-14 shrink-0 border border-[#c8aa64] text-[#c8aa64] flex items-center justify-center text-xl hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all">
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="flex-1">
                   <p className="text-[0.65rem] tracking-widest text-[#9a8e7a] uppercase mb-3">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</p>
                   <audio 
                     ref={audioRef}
                     src={lang === 'tr' ? activeArtifact.audio_tr : activeArtifact.audio_en}
                     controls
                     className="w-full h-8 outline-none grayscale opacity-80"
                     onPlay={() => setIsPlaying(true)}
                     onPause={() => setIsPlaying(false)}
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANA SAYFA (TÜM ESERLER) */}
      {view === 'home' && (
        <div id="main-content">
          <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-8">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#c8aa64] mx-auto mb-8"></div>
            
            {/* İYİLEŞTİRME 2: İSTENİLEN REFERANS BAŞLIK */}
            <p className="text-[0.6rem] tracking-[0.35em] text-[#c8aa64] uppercase mb-6">
              {lang === 'tr' ? 'Kültürel Miras · Tunceli' : 'Cultural Heritage · Tunceli'}
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-light text-[#f0e8d8] mb-4 leading-tight">
              Tunceli<br/><em className="text-[#e8d090] italic">Müzesi</em>
            </h1>
            <p className="text-[0.7rem] tracking-[0.25em] text-[#9a8e7a] uppercase mb-14">
              {lang === 'tr' ? 'Tarihin Sessiz Tanıkları' : 'Silent Witnesses of History'}
            </p>

            {/* İYİLEŞTİRME 3: ORTADAKİ BÜYÜK DİL BUTONLARI */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button onClick={() => handleSetLang('tr')} className={`px-12 py-3.5 text-xs tracking-[0.2em] transition-all border border-[#c8aa64] uppercase ${lang === 'tr' ? 'bg-[#c8aa64] text-[#0d0b08] font-bold' : 'bg-transparent text-[#c8aa64] hover:bg-[#c8aa64]/10'}`}>
                Türkçe
              </button>
              <button onClick={() => handleSetLang('en')} className={`px-12 py-3.5 text-xs tracking-[0.2em] transition-all border border-[#c8aa64] uppercase ${lang === 'en' ? 'bg-[#c8aa64] text-[#0d0b08] font-bold' : 'bg-transparent text-[#c8aa64] hover:bg-[#c8aa64]/10'}`}>
                English
              </button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[0.6rem] tracking-[0.3em] text-[#9a8e7a] uppercase">
              <span>{lang === 'tr' ? 'Keşfet' : 'Explore'}</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#c8aa64]/50 to-transparent"></div>
            </div>
          </section>

          <div className="flex items-center gap-6 px-8 max-w-5xl mx-auto my-16">
            <div className="flex-1 h-[1px] bg-[rgba(200,170,100,0.18)]"></div>
            <div className="text-[0.65rem] tracking-[0.3em] text-[#c8aa64] uppercase">{lang === 'tr' ? 'Koleksiyon' : 'Collection'}</div>
            <div className="flex-1 h-[1px] bg-[rgba(200,170,100,0.18)]"></div>
          </div>

          <section className="px-8 pb-32 max-w-5xl mx-auto">
            {/* İYİLEŞTİRME 4: KARTLAR ARASI BOŞLUK (gap-12) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {artifacts.map((a) => (
                <div key={a.id} onClick={() => openDetail(a.id)} className="bg-[#16130e] border border-[rgba(200,170,100,0.18)] flex flex-col cursor-pointer transition-all hover:bg-[#1e1a14] hover:border-[#c8aa64]/50 shadow-xl shadow-black/50">
                  <div className="relative w-full aspect-[4/3] bg-[#0d0b08] flex items-center justify-center border-b border-[rgba(200,170,100,0.18)]">
                     <span className="text-4xl opacity-10">🏺</span>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.7rem] font-bold tracking-[0.4em] text-[#c8aa64] uppercase">
                       No. {String(a.id).padStart(2,'0')}
                     </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-[0.6rem] tracking-[0.3em] text-[#c8aa64] uppercase mb-3">{lang === 'tr' ? a.era_tr : a.era_en}</div>
                    <div className="font-display text-2xl text-[#f0e8d8] mb-1">{lang === 'tr' ? a.name_tr : a.name_en}</div>
                    <div className="font-display italic text-sm text-[#9a8e7a] mb-5">{lang === 'tr' ? a.name_en : a.name_tr}</div>
                    <p className="text-xs leading-relaxed text-[#9a8e7a] flex-1 mb-8">{(lang === 'tr' ? a.desc_tr : a.desc_en).slice(0, 110)}…</p>
                    <div className="flex items-center justify-between pt-5 border-t border-[rgba(200,170,100,0.18)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-[#c8aa64]/50 text-[#c8aa64] flex items-center justify-center text-[0.6rem]">▶</div>
                        <span className="text-[0.6rem] tracking-[0.2em] text-[#9a8e7a] uppercase">{lang === 'tr' ? 'Sesli Rehber' : 'Audio'}</span>
                      </div>
                      <div className="text-[#c8aa64] text-sm bg-[#c8aa64]/10 p-1">↗</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="py-20 px-8 border-t border-[rgba(200,170,100,0.18)] text-center bg-[#0d0b08]">
            <div className="font-display text-4xl font-light text-[#f0e8d8] mb-4">Tunceli <span className="text-[#c8aa64] italic">Müzesi</span></div>
            <div className="text-[0.65rem] tracking-[0.25em] text-[#9a8e7a] uppercase mb-10">{lang === 'tr' ? 'Dijital Rehber' : 'Digital Guide'}</div>
            <div className="text-[0.65rem] tracking-[0.2em] text-[#c8aa64]/50 uppercase">Geliştirici: orhanpala.com</div>
          </footer>
        </div>
      )}
    </>
  );
}
