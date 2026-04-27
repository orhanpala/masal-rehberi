'use client';

import { useState, useEffect, useRef } from 'react';
import { artifacts } from '../data/artifacts';

export default function MasalRehberi() {
  const [lang, setLang] = useState('tr');
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [showQrLangModal, setShowQrLangModal] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('prefLang');
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (savedLang) setLang(savedLang);
    
    // QR KOD İLE GİRİŞ KONTROLÜ
    if (idParam) {
      const found = artifacts.find(a => a.id == idParam);
      if (found) {
        setActiveArtifact(found);
        // Eğer QR ile gelmişse, önce dil seçme ekranını göster
        setShowQrLangModal(true);
      }
    }
  }, []);

  const handleSetLang = (l) => {
    setLang(l);
    localStorage.setItem('prefLang', l);
    setShowQrLangModal(false); // Dil seçilince karşılama ekranını kapat
  };

  const openModal = (artifact) => {
    window.history.pushState({}, '', `?id=${artifact.id}`);
    setActiveArtifact(artifact);
  };

  const closeModal = () => {
    window.history.pushState({}, '', '?');
    setActiveArtifact(null);
    setShowQrLangModal(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <>
      {/* ── 1. SABİT SAĞ ÜST DİL SEÇİCİ (HER ZAMAN ORADA) ── */}
      <div style={{ position: 'fixed', top: '15px', right: '15px', zIndex: 99999, display: 'flex', gap: '5px', background: 'rgba(13, 11, 8, 0.95)', padding: '6px', border: '1px solid #c8aa64' }}>
        <button onClick={() => handleSetLang('tr')} style={{ padding: '12px 20px', fontSize: '16px', letterSpacing: '2px', fontWeight: 'bold', background: lang === 'tr' ? '#c8aa64' : 'transparent', color: lang === 'tr' ? '#0d0b08' : '#c8aa64', border: 'none', cursor: 'pointer' }}>TR</button>
        <button onClick={() => handleSetLang('en')} style={{ padding: '12px 20px', fontSize: '16px', letterSpacing: '2px', fontWeight: 'bold', background: lang === 'en' ? '#c8aa64' : 'transparent', color: lang === 'en' ? '#0d0b08' : '#c8aa64', border: 'none', cursor: 'pointer' }}>EN</button>
      </div>

      {/* ── 2. QR KARŞILAMA EKRANI (İLK GİRİŞTE DİL SEÇİMİ) ── */}
      {showQrLangModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#0d0b08', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div className="hero-line" style={{ height: '60px', marginBottom: '2rem' }}></div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#f0e8d8', marginBottom: '1rem' }}>Hoş Geldiniz</h2>
          <p style={{ color: '#c8aa64', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '3rem', textTransform: 'uppercase' }}>Lütfen Dil Seçiniz / Please Select Language</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
            <button onClick={() => handleSetLang('tr')} style={{ padding: '18px', border: '1px solid #c8aa64', color: '#c8aa64', background: 'transparent', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px' }}>Türkçe</button>
            <button onClick={() => handleSetLang('en')} style={{ padding: '18px', border: '1px solid #c8aa64', color: '#c8aa64', background: 'transparent', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px' }}>English</button>
          </div>
        </div>
      )}

      {/* ── 3. MODAL (Eser Detayı - Sadece Dil Seçildiyse Görünür) ── */}
      <div className={`modal-overlay ${activeArtifact && !showQrLangModal ? 'open' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}>
        <div className="modal">
          <button className="modal-close" style={{ left: '15px', right: 'auto', top: '15px', width: '45px', height: '45px', fontSize: '22px' }} onClick={closeModal}>✕</button>
          
          {activeArtifact && (
            <>
              <div className="modal-header" style={{ paddingTop: '80px' }}>
                <div className="modal-era">{lang === 'tr' ? activeArtifact.era_tr : activeArtifact.era_en}</div>
                <h2 className="modal-title">{lang === 'tr' ? activeArtifact.name_tr : activeArtifact.name_en}</h2>
                <div className="modal-title-en">{lang === 'tr' ? activeArtifact.name_en : activeArtifact.name_tr}</div>
              </div>
                           <div className="modal-body">
                {/* 1. ÖNCE SESLİ TANITIM EKRANI */}
                <div className="modal-audio-section" style={{ marginBottom: '2.5rem' }}>
                  <div className="modal-audio-label">{lang === 'tr' ? 'SESLİ TANITIM' : 'AUDIO GUIDE'}</div>
                  <div className="audio-player">
                     <audio 
                       key={`${activeArtifact.id}-${lang}`}
                       ref={audioRef}
                       src={lang === 'tr' ? activeArtifact.audio_tr : activeArtifact.audio_en}
                       controls
                       className="w-full outline-none grayscale opacity-80"
                     />
                  </div>
                </div>

                                {/* 2. SONRA ESER AÇIKLAMASI */}
                <p className="modal-description" style={{ marginBottom: '0' }}>
                  {lang === 'tr' ? activeArtifact.desc_tr : activeArtifact.desc_en}
                </p>

                {/* 3. KAYNAKÇA / ALINTI METNİ */}
                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(200, 170, 100, 0.3)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(240, 232, 216, 0.6)', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
                    {lang === 'tr' 
                      ? "Bu çalışmada hazırladığımız sesli masal projesinde, Tunceli’den Derlenen Masallar (Metin-İnceleme) adlı doktora tezinden yararlanılmıştır. Yılmaz Kaval tarafından hazırlanan bu tez, masalların içerik ve yapı açısından anlaşılmasına katkı sağlamış ve çalışmamıza kaynaklık etmiştir. Eser, Uşak Üniversitesi Sosyal Bilimler Enstitüsü bünyesinde, danışman Derya Özcan eşliğinde hazırlanmıştır (2019)."
                      : "In this audio tale project, the doctoral thesis titled 'Tales Compiled from Tunceli (Text-Analysis)' was utilized. This thesis, prepared by Yılmaz Kaval, contributed to the understanding of the tales in terms of content and structure and served as a source for our work. The work was prepared at Uşak University Institute of Social Sciences under the supervision of Derya Özcan (2019)."}
                  </p>
                </div>
              </div>


            </>
          )}
        </div>
      </div>

      {/* ── 4. ANA SAYFA İÇERİĞİ ── */}
      <section className="hero">
        <div className="hero-line"></div>
        <div className="hero-label">{lang === 'tr' ? 'Kültürel Miras · Tunceli' : 'Cultural Heritage · Tunceli'}</div>
        <h1 className="hero-title">Masal<br/><em>Rehberi</em></h1>
        <p className="hero-sub">{lang === 'tr' ? 'Tunceli Müzesi' : 'Tunceli Museum'}</p>
        <div className="hero-scroll">
          <span>{lang === 'tr' ? 'Keşfet' : 'Explore'}</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      <div className="divider">
        <div className="divider-line"></div>
        <div className="divider-diamond"></div>
        <div className="divider-text">{lang === 'tr' ? 'Koleksiyon' : 'Collection'}</div>
        <div className="divider-diamond"></div>
        <div className="divider-line"></div>
      </div>

      <section className="artifacts-section">
        <div className="section-header">
          <div className="section-number">01 — 06</div>
          <h2 className="section-title">{lang === 'tr' ? 'Seçili Masallar' : 'Featured Tales'}</h2>
          <p className="section-desc">
            {lang === 'tr' 
              ? "Tunceli'nin sözlü kültüründen derlenen en özel masallar. Her birini detaylı olarak okuyabilir ve sesli olarak dinleyebilirsiniz." 
              : "Special tales compiled from Tunceli's oral culture. You can read each in detail and listen to its audio presentation."}
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

            {/* ── AKADEMİK KAYNAKÇA BÖLÜMÜ (ANA SAYFA) ── */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(200, 170, 100, 0.2)', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.85rem', color: 'rgba(240, 232, 216, 0.5)', fontStyle: 'italic', lineHeight: '1.8', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          {lang === 'tr' 
            ? "Bu çalışmada hazırladığımız sesli masal projesinde, Tunceli’den Derlenen Masallar (Metin-İnceleme) adlı doktora tezinden yararlanılmıştır. Yılmaz Kaval tarafından hazırlanan bu tez, masalların içerik ve yapı açısından anlaşılmasına katkı sağlamış ve çalışmamıza kaynaklık etmiştir. Eser, Uşak Üniversitesi Sosyal Bilimler Enstitüsü bünyesinde, danışman Derya Özcan eşliğinde hazırlanmıştır (2019)."
            : "In this audio tale project, the doctoral thesis titled 'Tales Compiled from Tunceli (Text-Analysis)' was utilized. This thesis, prepared by Yılmaz Kaval, contributed to the understanding of the tales in terms of content and structure and served as a source for our work. The work was prepared at Uşak University Institute of Social Sciences under the supervision of Derya Özcan (2019)."}
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">Masal <span>Rehberi</span></div>
        <div className="footer-meta">{lang === 'tr' ? 'Tunceli Müzesi Dijital Rehber' : 'Tunceli Museum Digital Guide'}</div>
        <div className="footer-meta mt-2" style={{opacity: 0.8}}>
          Geliştirici: <a href="https://orhanpala.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8aa64', textDecoration: 'underline' }}>orhanpala.com</a>
        </div>
      </footer>

    </>
  );
}
