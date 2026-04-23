'use client';

import { useState, useEffect, useRef } from 'react';
import { artifacts } from '../data/artifacts';

export default function MasalRehberi() {
  const [lang, setLang] = useState('tr');
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('home'); // 'home' veya 'detail'
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [showQrLangModal, setShowQrLangModal] = useState(false);

  // Ses oynatıcı referansı
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('prefLang');
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    // Senaryo 2: QR Kod ile gelindiyse
    if (idParam) {
      const found = artifacts.find(a => a.id == idParam);
      if (found) {
        setActiveArtifact(found);
        setView('detail');
        
        if (!savedLang) {
          // Daha önce dil seçimi yapmamış, QR ile gelmiş (Karşılama Ekranı)
          setShowQrLangModal(true);
        } else {
          setLang(savedLang);
        }
      }
    } else {
      // Senaryo 1: Doğrudan ana sayfaya gelindiyse
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

  // QR İlk Giriş Dil Seçim Ekranı (Senaryo 2 için)
  if (showQrLangModal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="hero-title mb-8">Masal<br/><em>Rehberi</em></h1>
        <p className="text-xl text-[#c8aa64] mb-8 font-light tracking-widest uppercase">Lütfen Dil Seçiniz<br/><br/>Please Select Language</p>
        <div className="flex gap-4">
          <button onClick={() => handleSetLang('tr')} className="px-8 py-3 border border-[#c8aa64] text-[#c8aa64] hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all uppercase tracking-widest text-sm">Türkçe</button>
          <button onClick={() => handleSetLang('en')} className="px-8 py-3 border border-[#c8aa64] text-[#c8aa64] hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all uppercase tracking-widest text-sm">English</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sabit Dil Seçici (Sağ Üst) */}
      <div className="fixed top-6 right-6 z-50 flex gap-2 bg-[#0d0b08]/80 p-1 rounded-full backdrop-blur-md border border-[rgba(200,170,100,0.18)]">
        <button onClick={() => handleSetLang('tr')} className={`px-4 py-2 rounded-full text-xs font-light tracking-widest transition-all ${lang === 'tr' ? 'bg-[#c8aa64] text-[#0d0b08]' : 'text-[#9a8e7a]'}`}>TR</button>
        <button onClick={() => handleSetLang('en')} className={`px-4 py-2 rounded-full text-xs font-light tracking-widest transition-all ${lang === 'en' ? 'bg-[#c8aa64] text-[#0d0b08]' : 'text-[#9a8e7a]'}`}>EN</button>
      </div>

      {/* DETAY SAYFASI (ESER GÖRÜNÜMÜ) */}
      {view === 'detail' && activeArtifact && (
        <div className="min-h-screen bg-[#16130e] w-full max-w-3xl mx-auto relative animate-in fade-in duration-500">
          <button onClick={closeDetail} className="absolute top-6 left-6 w-10 h-10 border border-[rgba(200,170,100,0.18)] bg-[#1e1a14] text-[#c8aa64] rounded-full flex items-center justify-center text-xl z-10 transition-colors hover:bg-[#c8aa64] hover:text-[#0d0b08]">←</button>
          
          <div className="pt-24 pb-8 px-8 border-b border-[rgba(200,170,100,0.18)] text-center">
            <div className="text-[0.7rem] tracking-[0.35em] text-[#c8aa64] uppercase mb-4">{lang === 'tr' ? activeArtifact.era_tr : activeArtifact.era_en}</div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#f0e8d8] mb-2">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</h2>
            <div className="font-display italic text-xl text-[#9a8e7a]">{lang === 'tr' ? activeArtifact.name_en : activeArtifact.name_tr}</div>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-base md:text-lg leading-loose text-[#f0e8d8] mb-12 font-display font-light tracking-wide">{lang === 'tr' ? activeArtifact.desc_tr : activeArtifact.desc_en}</p>
            
            <div className="mt-8">
              <div className="text-[0.6rem] tracking-[0.35em] text-[#c8aa64] uppercase mb-4">{lang === 'tr' ? 'SESLİ TANITIM' : 'AUDIO GUIDE'}</div>
              <div className="flex items-center gap-4 p-6 border border-[rgba(200,170,100,0.18)] bg-[#1e1a14] rounded-xl">
                <button onClick={toggleAudio} className="w-14 h-14 shrink-0 border border-[#c8aa64] text-[#c8aa64] rounded-full flex items-center justify-center text-xl hover:bg-[#c8aa64] hover:text-[#0d0b08] transition-all">
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="flex-1">
                   <p className="text-xs tracking-widest text-[#9a8e7a] uppercase mb-2">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</p>
                   {/* Tarayıcı varsayılan ses oynatıcısı (mobil uyumlu) */}
                   <audio 
                     ref={audioRef}
                     src={lang === 'tr' ? activeArtifact.audio_tr : activeArtifact.audio_en}
                     controls
                     className="w-full h-8 outline-none"
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
          <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,32,32,0.25)_0%,transparent_60%)]">
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#c8aa64] mx-auto mb-10"></div>
            <h1 className="font-display text-6xl md:text-8xl font-light text-[#f0e8d8] mb-2 leading-none">
              Masal<br/><em className="text-[#e8d090] italic">Rehberi</em>
            </h1>
            <p className="font-display text-xl md:text-2xl tracking-[0.1em] text-[#c8aa64] mt-4 mb-12">
              {lang === 'tr' ? 'Tunceli Müzesi' : 'Tunceli Museum'}
            </p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-[#9a8e7a] uppercase">
              <span>{lang === 'tr' ? 'Keşfet' : 'Explore'}</span>
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#c8aa64]/40 to-transparent animate-pulse"></div>
            </div>
          </section>

          <div className="flex items-center gap-6 px-8 max-w-5xl mx-auto my-12">
            <div className="flex-1 h-[1px] bg-[rgba(200,170,100,0.18)]"></div>
            <div className="w-1.5 h-1.5 bg-[#c8aa64] rotate-45"></div>
            <div className="text-[0.65rem] tracking-[0.3em] text-[#c8aa64] uppercase">{lang === 'tr' ? 'Koleksiyon' : 'Collection'}</div>
            <div className="w-1.5 h-1.5 bg-[#c8aa64] rotate-45"></div>
            <div className="flex-1 h-[1px] bg-[rgba(200,170,100,0.18)]"></div>
          </div>

          <section className="px-8 pb-24 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] border border-[rgba(200,170,100,0.18)] bg-[rgba(200,170,100,0.18)]">
              {artifacts.map((a) => (
                <div key={a.id} onClick={() => openDetail(a.id)} className="bg-[#1e1a14] flex flex-col cursor-pointer transition-colors hover:bg-[#231f17]">
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#1e1a14] to-[#2a2318] flex items-center justify-center border-b border-[rgba(200,170,100,0.18)]">
                     <span className="text-5xl opacity-10">🏺</span>
                     <div className="absolute top-4 left-4 text-[0.6rem] tracking-[0.3em] text-[#c8aa64] bg-[#0d0b08]/80 px-3 py-1 uppercase backdrop-blur-sm">
                       No. {String(a.id).padStart(2,'0')}
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[0.6rem] tracking-[0.3em] text-[#c8aa64] uppercase mb-2">{lang === 'tr' ? a.era_tr : a.era_en}</div>
                    <div className="font-display text-2xl text-[#f0e8d8] mb-1">{lang === 'tr' ? a.name_tr : a.name_en}</div>
                    <div className="font-display italic text-sm text-[#9a8e7a] mb-4">{lang === 'tr' ? a.name_en : a.name_tr}</div>
                    <p className="text-xs leading-relaxed text-[#9a8e7a] flex-1 mb-6">{(lang === 'tr' ? a.desc_tr : a.desc_en).slice(0, 100)}…</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(200,170,100,0.18)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-[#c8aa64]/30 text-[#c8aa64] flex items-center justify-center text-xs">▶</div>
                        <span className="text-[0.6rem] tracking-[0.2em] text-[#9a8e7a] uppercase">{lang === 'tr' ? 'Sesli Rehber' : 'Audio'}</span>
                      </div>
                      <div className="text-[#9a8e7a] text-sm">↗</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="py-16 px-8 border-t border-[rgba(200,170,100,0.18)] text-center">
            <div className="font-display text-3xl font-light text-[#f0e8d8] mb-3">Masal <span className="text-[#c8aa64] italic">Rehberi</span></div>
            <div className="text-[0.65rem] tracking-[0.25em] text-[#9a8e7a] uppercase mb-8">{lang === 'tr' ? 'Tunceli Müzesi Dijital Rehberi' : 'Tunceli Museum Digital Guide'}</div>
            <div className="text-[0.7rem] tracking-[0.2em] text-[#c8aa64]/70 uppercase">Geliştirici: orhanpala.com</div>
          </footer>
        </div>
      )}
    </>
  );
}
