'use client';

import { useState, useEffect, useRef } from 'react';
import { artifacts } from '../data/artifacts';

export default function MasalRehberi() {
  const [lang, setLang] = useState('tr');
  const [activeArtifact, setActiveArtifact] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('prefLang');
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (savedLang) setLang(savedLang);
    
    // QR'dan direkt bir esere gelindiyse Modal'ı aç
    if (idParam) {
      const found = artifacts.find(a => a.id == idParam);
      if (found) setActiveArtifact(found);
    }
  }, []);

  const handleSetLang = (l) => {
    setLang(l);
    localStorage.setItem('prefLang', l);
  };

  const openModal = (artifact) => {
    window.history.pushState({}, '', `?id=${artifact.id}`);
    setActiveArtifact(artifact);
  };

  const closeModal = () => {
    window.history.pushState({}, '', '?');
    setActiveArtifact(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <>
      {/* ── MODAL (Eser Detayı) ── */}
      <div className={`modal-overlay ${activeArtifact ? 'open' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>✕</button>
          
          {activeArtifact && (
            <>
              <div className="modal-header">
                <div className="modal-era">{lang === 'tr' ? activeArtifact.era_tr : activeArtifact.era_en}</div>
                <h2 className="modal-title">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</h2>
                <div className="modal-title-en">{lang === 'tr' ? activeArtifact.name_en : activeArtifact.name_tr}</div>
              </div>
              <div className="modal-body">
                <p className="modal-description">{lang === 'tr' ? activeArtifact.desc_tr : activeArtifact.desc_en}</p>
                <div className="modal-audio-section">
                  <div className="modal-audio-label">{lang === 'tr' ? 'SESLİ TANITIM' : 'AUDIO GUIDE'}</div>
                  <div className="audio-player">
                     {/* Orijinal tasarımdaki kutunun içine modern ve sorunsuz çalışan ses oynatıcıyı yerleştirdik */}
                     <audio 
                       ref={audioRef}
                       src={lang === 'tr' ? activeArtifact.audio_tr : activeArtifact.audio_en}
                       controls
                       className="w-full outline-none grayscale opacity-80"
                     />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── HERO (Karşılama Ekranı) ── */}
      <section className="hero">
        <div className="hero-line"></div>
        <div className="hero-label">{lang === 'tr' ? 'Kültürel Miras · Tunceli' : 'Cultural Heritage · Tunceli'}</div>
        
        {/* Senin isteğin üzerine başlık güncellendi */}
        <h1 className="hero-title">Masal<br/><em>Rehberi</em></h1>
        <p className="hero-sub">{lang === 'tr' ? 'Tunceli Müzesi' : 'Tunceli Museum'}</p>

        <div className="lang-selector">
          <button className={`lang-btn ${lang === 'tr' ? 'active' : ''}`} onClick={() => handleSetLang('tr')}>Türkçe</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => handleSetLang('en')}>English</button>
        </div>

        <div className="hero-scroll">
          <span>{lang === 'tr' ? 'Keşfet' : 'Explore'}</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="divider">
        <div className="divider-line"></div>
        <div className="divider-diamond"></div>
        <div className="divider-text">{lang === 'tr' ? 'Koleksiyon' : 'Collection'}</div>
        <div className="divider-diamond"></div>
        <div className="divider-line"></div>
      </div>

      {/* ── ARTIFACTS SECTION ── */}
      <section className="artifacts-section">
        <div className="section-header">
          <div className="section-number">01 — 06</div>
          <h2 className="section-title">{lang === 'tr' ? 'Seçili Eserler' : 'Featured Artifacts'}</h2>
          <p className="section-desc">
            {lang === 'tr' 
              ? "Müzemizin en değerli parçalarından altı eser. Her birini detaylı olarak inceleyebilir ve sesli tanıtımını dinleyebilirsiniz." 
              : "Six of our museum's most treasured pieces. You can examine each in detail and listen to its audio presentation."}
          </p>
        </div>

        <div className="grid-container">
          {artifacts.map((a) => (
            <div key={a.id} className="card" onClick={() => openModal(a)}>
              <div className="card-image-wrap">
                <div className="card-placeholder">
                  <span className="placeholder-icon">🏺</span>
                </div>
                <div className="card-number">No. {String(a.id).padStart(2,'0')}</div>
              </div>
              <div className="card-body">
                <div className="card-era">{lang === 'tr' ? a.era_tr : a.era_en}</div>
                <div className="card-name">{lang === 'tr' ? a.name_tr : a.name_en}</div>
                <div className="card-name-en">{lang === 'tr' ? a.name_en : a.name_tr}</div>
                <p className="card-desc">{(lang === 'tr' ? a.desc_tr : a.desc_en).slice(0, 120)}…</p>
                <div className="card-footer">
                  <div className="card-audio">
                    <button className="audio-btn">▶</button>
                    <span className="audio-label">{lang === 'tr' ? 'Sesli Rehber' : 'Audio Guide'}</span>
                  </div>
                  <div className="card-arrow">↗</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">Masal <span>Rehberi</span></div>
        <div className="footer-meta">{lang === 'tr' ? 'Tunceli Müzesi Dijital Rehber' : 'Tunceli Museum Digital Guide'}</div>
        {/* Senin belirlediğin geliştirici imzası */}
        <div className="footer-meta mt-2" style={{opacity: 0.5}}>Geliştirici: orhanpala.com</div>
      </footer>
    </>
  );
}
