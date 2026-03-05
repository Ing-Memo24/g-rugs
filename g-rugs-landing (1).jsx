import { useState, useEffect, useRef } from "react";

const COLORS = {
  charcoal: "#1a1a1a",
  deepBlack: "#0d0d0d",
  cyan: "#FFB300",
  burn: "#FF4500",
  orange: "#FF6B00",
  white: "#F5F5F5",
  gray: "#888",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=IBM+Plex+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --amber: #FFB300;
    --burn: #FF4500;
    --orange: #FF6B00;
    --charcoal: #1a1a1a;
    --deep: #0d0d0d;
    --white: #F5F5F5;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--deep);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .mono { font-family: 'IBM Plex Mono', monospace; }

  /* Concrete texture background */
  .concrete-bg {
    background-color: #1c1c1c;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.01) 2px,
        rgba(255,255,255,0.01) 4px
      );
  }

  /* Iridescent G */
  .burnished-g {
    background: linear-gradient(135deg, #FF4500, #FFB300, #FF6B00, #FF8C00, #FF4500, #FF6B00);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: burnishShift 4s ease infinite;
    filter: drop-shadow(0 0 40px rgba(255,179,0,0.4)) drop-shadow(0 0 80px rgba(255,69,0,0.3));
  }

  @keyframes burnishShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Hard shadows */
  .hard-shadow { box-shadow: 6px 6px 0px var(--amber); }
  .hard-shadow-burn { box-shadow: 6px 6px 0px var(--burn); }
  .hard-shadow-orange { box-shadow: 6px 6px 0px var(--orange); }

  /* Amber border */
  .amber-border { border: 1px solid var(--amber); }
  .burn-border { border: 1px solid var(--burn); }

  /* Magenta glow */
  .burn-glow {
    box-shadow: 0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2), inset 0 0 20px rgba(255,69,0,0.05);
  }

  /* Glitch effect */
  @keyframes glitch1 {
    0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
    20% { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); }
    40% { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 0); }
    60% { clip-path: inset(80% 0 5% 0); transform: translate(1px, 0); }
    80% { clip-path: inset(10% 0 85% 0); transform: translate(0px, 0); }
  }

  @keyframes glitch2 {
    0%, 100% { clip-path: inset(80% 0 5% 0); transform: translate(2px, 0); color: var(--amber); }
    20% { clip-path: inset(5% 0 80% 0); transform: translate(-2px, 0); color: var(--burn); }
    40% { clip-path: inset(30% 0 50% 0); transform: translate(1px, 0); }
    60% { clip-path: inset(60% 0 20% 0); transform: translate(-1px, 0); }
    80% { clip-path: inset(90% 0 2% 0); transform: translate(0px, 0); }
  }

  .glitch-container { position: relative; display: inline-block; }

  .glitch-base { position: relative; }

  .glitch-layer1 {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    color: var(--amber);
    animation: glitch1 3s infinite;
    opacity: 0.6;
  }

  .glitch-layer2 {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    color: var(--burn);
    animation: glitch2 3s infinite 0.1s;
    opacity: 0.6;
  }

  /* Gallery item hover */
  .gallery-item {
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .gallery-item:hover { transform: scale(1.02); }

  .gallery-item-inner {
    width: 100%;
    height: 100%;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .gallery-item:hover .gallery-item-inner { transform: scale(1.08); }

  .gallery-fire-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,179,0,0.15), rgba(255,69,0,0.15), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .gallery-item:hover .gallery-fire-overlay { opacity: 1; }

  /* Tag icon styles */
  .tag-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--orange);
    transform: rotate(-5deg);
    transition: transform 0.3s ease;
  }

  .tag-icon:hover { transform: rotate(0deg) scale(1.05); }

  /* Nav */
  .nav-link {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--white);
    text-decoration: none;
    transition: color 0.2s;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
  }

  .nav-link:hover { color: var(--amber); border-bottom-color: var(--amber); }

  /* Form inputs */
  .form-input {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    border-bottom: 2px solid var(--amber);
    color: var(--white);
    padding: 12px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    width: 100%;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-input:focus {
    border-color: var(--burn);
    box-shadow: 0 4px 20px rgba(255,69,0,0.15);
  }

  .form-input::placeholder { color: rgba(255,255,255,0.3); }

  .form-input option { background: #1a1a1a; }

  /* CTA Button */
  .btn-burn {
    background: var(--burn);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 16px 40px;
    border: none;
    cursor: pointer;
    position: relative;
    box-shadow: 4px 4px 0px rgba(255,69,0,0.4), 0 0 30px rgba(255,69,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-burn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px rgba(255,69,0,0.6), 0 0 50px rgba(255,69,0,0.6);
  }

  .btn-burn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px rgba(255,69,0,0.4); }

  /* Scanline overlay */
  .scanlines::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Scroll reveal */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* Marquee */
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .marquee-track { animation: marquee 18s linear infinite; }

  /* Section divider */
  .divider-line {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }

  /* Number label */
  .step-number {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    color: var(--orange);
    letter-spacing: 0.2em;
  }

  textarea.form-input { resize: vertical; min-height: 100px; }

  select.form-input { cursor: pointer; }
`;

// ─── SVG Tag Icons ───────────────────────────────────────────────────
const TagIconBorder = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="8" width="24" height="18" rx="2" stroke="#FF6B00" strokeWidth="2"/>
    <line x1="8" y1="8" x2="6" y2="2" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="8" x2="16" y2="2" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="14" x2="20" y2="14" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="19" x2="18" y2="19" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TagIconTexture = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="1" stroke="#FF6B00" strokeWidth="2"/>
    <rect x="8" y="8" width="16" height="16" rx="1" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="16" cy="16" r="4" stroke="#FF6B00" strokeWidth="1.5"/>
    <line x1="16" y1="4" x2="16" y2="8" stroke="#FF6B00" strokeWidth="1.5"/>
    <line x1="16" y1="24" x2="16" y2="28" stroke="#FF6B00" strokeWidth="1.5"/>
    <line x1="4" y1="16" x2="8" y2="16" stroke="#FF6B00" strokeWidth="1.5"/>
    <line x1="24" y1="16" x2="28" y2="16" stroke="#FF6B00" strokeWidth="1.5"/>
  </svg>
);

const TagIconDrop = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L26 22 Q26 28 16 28 Q6 28 6 22 Z" stroke="#FF6B00" strokeWidth="2" fill="none"/>
    <path d="M11 20 Q16 14 21 20" stroke="#FF6B00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="16" cy="22" r="2" fill="#FF6B00" opacity="0.5"/>
  </svg>
);

const TagIconCustom = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#FF6B00" strokeWidth="2" fill="none"/>
    <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" stroke="#FF6B00" strokeWidth="1" fill="none" opacity="0.5"/>
    <line x1="16" y1="8" x2="16" y2="24" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 1"/>
    <line x1="8" y1="12" x2="24" y2="20" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 1"/>
    <line x1="24" y1="12" x2="8" y2="20" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 1"/>
  </svg>
);

// ─── Unsplash real photos for gallery ───────────────────────────────
// Each photo: real rugs in urban lofts, graffiti walls, sneakers on rugs
const GALLERY_PHOTOS = [
  {
    // Bold geometric rug on raw concrete loft floor
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Geometric rug concrete loft"
  },
  {
    // Textured rug close-up warm tones
    url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80",
    alt: "Textured rug warm close-up"
  },
  {
    // Urban interior with bold rug and graffiti wall
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    alt: "Urban interior bold rug"
  },
  {
    // Sneakers hypebeast on rug
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    alt: "Hypebeast sneakers on rug"
  },
  {
    // Dark moody loft interior rug
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    alt: "Dark moody loft rug"
  },
  {
    // Abstract rug texture detail
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Abstract rug texture"
  },
];

// ─── Noise texture overlay component ────────────────────────────────
const NoiseOverlay = () => (
  <div style={{
    position:"absolute", inset:0, opacity:0.04, pointerEvents:"none", zIndex:2,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: '200px 200px',
  }}/>
);

// ─── Glitch Text ─────────────────────────────────────────────────────
function GlitchText({ text, style = {}, className = "" }) {
  return (
    <span className={`glitch-container ${className}`} style={{ ...style, position: "relative" }}>
      <span className="glitch-base" style={{ position: "relative" }}>{text}</span>
      <span className="glitch-layer1" aria-hidden="true" style={{ pointerEvents:"none" }}>{text}</span>
      <span className="glitch-layer2" aria-hidden="true" style={{ pointerEvents:"none" }}>{text}</span>
    </span>
  );
}

// ─── Scroll Reveal Hook ──────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function GRugsLanding() {
  const [formData, setFormData] = useState({ nombre: "", email: "", medidas: "", material: "", concepto: "" });
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroRef = useScrollReveal();
  const procesoRef = useScrollReveal();
  const galleryRef = useScrollReveal();
  const formRef = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ nombre: "", email: "", medidas: "", material: "", concepto: "" });
  };

  const processTags = [
    { icon: <TagIconBorder />, label: "Bordes de Precisión", sub: "Sin Fallos.", detail: "10×22 cm de margen exacto. Cada esquina es una declaración de intenciones.", code: "EDGE_001" },
    { icon: <TagIconTexture />, label: "Textura 3D Hardcore", sub: "Lo tocas, lo sientes.", detail: "Fibra premium loop-cut de alta densidad. No es una alfombra — es arquitectura táctil.", code: "TEX_002" },
    { icon: <TagIconDrop />, label: "Colores Sin Filtro", sub: "Tintes que gritan.", detail: "Pigmentación UV-resist. El Magenta no se lava. El Cian no se rinde.", code: "COL_003" },
    { icon: <TagIconCustom />, label: "Drop Custom Total", sub: "Tu diseño. Nuestras manos.", detail: "Desde boceto hasta pieza final en 14 días. Artwork original o colaboración directa.", code: "CUST_004" },
  ];



  const marqueeText = ["G-RUGS", "TU SUELO TUS REGLAS", "ARTE URBANO", "DROPS CUSTOM", "EXCLUSIVO", "PREMIUM", "STREETWEAR"];

  return (
    <>
      <style>{styles}</style>
      <div style={{ background: "#0d0d0d", minHeight: "100vh" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          borderBottom: "1px solid rgba(255,179,0,0.15)",
          backdropFilter: "blur(12px)",
          background: "rgba(13,13,13,0.9)",
          padding: "0 40px",
          height: "60px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{
              fontFamily:"Inter", fontWeight:900, fontSize:"1.4rem",
              background:"linear-gradient(135deg, #FF4500, #FFB300)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              letterSpacing:"0.05em"
            }}>G-RUGS</span>
            <span className="mono" style={{ fontSize:"0.6rem", color:"var(--orange)", letterSpacing:"0.2em", marginTop:2 }}>®STUDIO</span>
          </div>
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            {["Proceso","Gallery","Custom"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
            ))}
            <button className="btn-burn" style={{ padding:"8px 20px", fontSize:"0.7rem" }}>
              DROP NOW →
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" className="concrete-bg scanlines" style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", position:"relative",
          paddingTop:60, overflow:"hidden"
        }}>
          <NoiseOverlay />

          {/* Corner markers */}
          {[["0,0","right,bottom"],["0,auto","right,top"],["auto,0","left,bottom"],["auto,auto","left,top"]].map(([pos, label], i) => {
            const [top,bottom] = pos.split(",");
            const styles2 = { position:"absolute", [top!="auto"?"top":"bottom"]: 20,
              [label.includes("right")?"right":"left"]: 20 };
            return (
              <div key={i} style={styles2} className="mono"
                style={{ ...styles2, fontSize:"0.6rem", color:"rgba(255,179,0,0.3)", letterSpacing:"0.15em" }}>
                {`[${i.toString().padStart(2,"0")}]`}
              </div>
            );
          })}

          {/* Decorative lines */}
          <div style={{ position:"absolute", left:0, right:0, top:"50%", height:1,
            background:"linear-gradient(90deg, transparent, rgba(255,179,0,0.1), transparent)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:0, bottom:0, left:"50%", width:1,
            background:"linear-gradient(180deg, transparent, rgba(255,69,0,0.1), transparent)", pointerEvents:"none" }}/>

          <div ref={heroRef} className="reveal" style={{ textAlign:"center", position:"relative", zIndex:3, padding:"0 20px" }}>
            {/* Huge G */}
            <div className="burnished-g" style={{
              fontSize:"clamp(180px, 25vw, 380px)", fontWeight:900,
              lineHeight:0.85, fontFamily:"Inter", marginBottom:8,
              userSelect:"none"
            }}>G</div>

            {/* Horizontal rule */}
            <div style={{ width:"100%", maxWidth:600, height:2, background:"linear-gradient(90deg, var(--burn), var(--amber))", margin:"16px auto" }}/>

            <h1 style={{
              fontFamily:"Inter", fontWeight:900, fontSize:"clamp(1.8rem,5vw,3.5rem)",
              letterSpacing:"0.05em", textTransform:"uppercase",
              lineHeight:1.1, marginBottom:16
            }}>
              <span style={{ color:"var(--white)" }}>G-RUGS: </span>
              <span style={{ color:"var(--burn)", textShadow:"0 0 30px rgba(255,69,0,0.5)" }}>TU SUELO,</span>
              <br/>
              <span style={{ color:"var(--amber)", textShadow:"0 0 30px rgba(255,179,0,0.4)" }}>TUS REGLAS</span>
            </h1>

            <p className="mono" style={{
              fontSize:"clamp(0.75rem,1.5vw,1rem)", letterSpacing:"0.25em",
              color:"rgba(255,255,255,0.5)", textTransform:"uppercase", marginBottom:40
            }}>
              Alfombras Custom ·  Urbano Premium · Arte Para Tu Suelo
            </p>

            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="btn-burn" onClick={() => document.getElementById('custom').scrollIntoView({behavior:'smooth'})}>
                HAZ TU DROP →
              </button>
              <button style={{
                background:"transparent", border:"1px solid var(--amber)",
                color:"var(--amber)", fontFamily:"Inter", fontWeight:700,
                fontSize:"0.85rem", letterSpacing:"0.1em", textTransform:"uppercase",
                padding:"16px 40px", cursor:"pointer",
                transition:"all 0.2s", boxShadow:"4px 4px 0px rgba(255,179,0,0.2)"
              }}
                onMouseEnter={e=>{ e.target.style.background="rgba(255,179,0,0.1)"; }}
                onMouseLeave={e=>{ e.target.style.background="transparent"; }}
                onClick={() => document.getElementById('gallery').scrollIntoView({behavior:'smooth'})}>
                VER GALLERY
              </button>
            </div>
          </div>

          {/* Bottom scroll hint */}
          <div className="mono" style={{
            position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)",
            fontSize:"0.65rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.2em",
            display:"flex", flexDirection:"column", alignItems:"center", gap:6
          }}>
            <span>SCROLL_DOWN</span>
            <div style={{ width:1, height:30, background:"linear-gradient(180deg, rgba(255,179,0,0.5), transparent)" }}/>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{
          background:"var(--burn)", padding:"10px 0", overflow:"hidden",
          borderTop:"1px solid rgba(255,255,255,0.2)", borderBottom:"1px solid rgba(255,255,255,0.2)",
          boxShadow:"0 0 30px rgba(255,69,0,0.4)"
        }}>
          <div className="marquee-track" style={{ display:"flex", whiteSpace:"nowrap" }}>
            {[...marqueeText, ...marqueeText, ...marqueeText, ...marqueeText].map((t, i) => (
              <span key={i} style={{
                fontFamily:"Inter", fontWeight:900, fontSize:"0.8rem",
                letterSpacing:"0.3em", textTransform:"uppercase", color:"white",
                marginRight:60
              }}>{t} <span style={{ opacity:0.5, marginRight:60 }}>✦</span></span>
            ))}
          </div>
        </div>

        {/* ── PROCESO ── */}
        <section id="proceso" style={{ padding:"100px 40px", maxWidth:1200, margin:"0 auto" }}>
          <div ref={procesoRef} className="reveal">
            <div style={{ marginBottom:60 }}>
              <p className="step-number">// SECCIÓN_02 / EL PROCESO</p>
              <h2 style={{
                fontFamily:"Inter", fontWeight:900, fontSize:"clamp(2rem,5vw,3.5rem)",
                textTransform:"uppercase", letterSpacing:"0.03em", marginTop:8
              }}>
                El Proceso{" "}
                <span style={{ color:"var(--orange)", textShadow:"0 0 20px rgba(255,107,0,0.4)" }}>'Tagging'</span>
              </h2>
              <div className="mono" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", marginTop:8 }}>
                Así lo hacemos. Sin secretos.
              </div>
            </div>

            <div style={{
              display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",
              gap:2
            }}>
              {processTags.map((tag, i) => (
                <div key={i} style={{
                  background:"#111", border:"1px solid rgba(255,107,0,0.2)",
                  padding:32, position:"relative",
                  transition:"border-color 0.3s, background 0.3s",
                  cursor:"default"
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--orange)"; e.currentTarget.style.background="#161610"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,107,0,0.2)"; e.currentTarget.style.background="#111"; }}>
                  <div className="mono" style={{ fontSize:"0.6rem", color:"rgba(255,107,0,0.4)", marginBottom:20, letterSpacing:"0.2em" }}>
                    [{tag.code}]
                  </div>
                  <div className="tag-icon" style={{ marginBottom:20 }}>
                    {tag.icon}
                  </div>
                  <h3 style={{
                    fontFamily:"Inter", fontWeight:900, fontSize:"1.1rem",
                    textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4,
                    color:"var(--white)"
                  }}>{tag.label}</h3>
                  <p style={{ color:"var(--orange)", fontFamily:"Inter", fontWeight:700, fontSize:"0.85rem", marginBottom:12 }}>
                    {tag.sub}
                  </p>
                  <p className="mono" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.75rem", lineHeight:1.6 }}>
                    {tag.detail}
                  </p>
                  <div style={{
                    position:"absolute", bottom:16, right:16, width:6, height:6,
                    background:"var(--orange)", opacity:0.5
                  }}/>
                </div>
              ))}
            </div>

            {/* Technical spec bar */}
            <div className="amber-border" style={{
              marginTop:2, background:"rgba(255,179,0,0.03)",
              padding:"20px 32px", display:"flex", flexWrap:"wrap",
              gap:40, alignItems:"center"
            }}>
              {[
                ["MARGEN ESTÁNDAR", "10×22 cm"],
                ["DENSIDAD", "1.800 g/m²"],
                ["ENTREGA", "14 días"],
                ["GUARANTEE", "24 meses"],
              ].map(([k, v]) => (
                <div key={k} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  <span className="mono" style={{ fontSize:"0.6rem", color:"rgba(255,179,0,0.5)", letterSpacing:"0.2em" }}>{k}</span>
                  <span style={{ fontFamily:"Inter", fontWeight:900, fontSize:"1.1rem", color:"var(--amber)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-line" style={{ margin:"0 40px" }}/>

        {/* ── GALLERY ── */}
        <section id="gallery" style={{ padding:"100px 40px", maxWidth:1400, margin:"0 auto" }}>
          <div ref={galleryRef} className="reveal">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, flexWrap:"wrap", gap:16 }}>
              <div>
                <p className="step-number">// SECCIÓN_03 / THE GALLERY</p>
                <h2 style={{
                  fontFamily:"Inter", fontWeight:900, fontSize:"clamp(2rem,5vw,3.5rem)",
                  textTransform:"uppercase", letterSpacing:"0.03em", marginTop:8
                }}>
                  The Gallery{" "}
                  <span style={{ color:"var(--burn)", textShadow:"0 0 20px rgba(255,69,0,0.4)" }}>Drop</span>
                </h2>
              </div>
              <span className="mono" style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.15em" }}>
                006 PIEZAS ACTIVAS
              </span>
            </div>

            {/* Bento grid */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(4, 1fr)",
              gridTemplateRows:"repeat(3, 220px)",
              gap:4
            }}>
              {[
                { photo: GALLERY_PHOTOS[0], colSpan:2, rowSpan:2, label:"BURN CORE", tag:"#001", price:"desde €340" },
                { photo: GALLERY_PHOTOS[1], colSpan:1, rowSpan:2, label:"AMBER SPIRAL", tag:"#002", price:"desde €280" },
                { photo: GALLERY_PHOTOS[3], colSpan:1, rowSpan:1, label:"ORBIT", tag:"#004", price:"desde €220" },
                { photo: GALLERY_PHOTOS[2], colSpan:2, rowSpan:1, label:"GRID PHANTOM", tag:"#003", price:"desde €380" },
                { photo: GALLERY_PHOTOS[5], colSpan:1, rowSpan:1, label:"QUAD", tag:"#006", price:"desde €260" },
                { photo: GALLERY_PHOTOS[4], colSpan:2, rowSpan:1, label:"DIAMOND", tag:"#005", price:"desde €300" },
              ].map((item, i) => (
                <div key={i} className="gallery-item hard-shadow"
                  style={{
                    gridColumn:`span ${item.colSpan}`,
                    gridRow:`span ${item.rowSpan}`,
                    position:"relative",
                    border:"1px solid rgba(255,255,255,0.06)",
                    background:"#111"
                  }}>
                  <div className="gallery-item-inner" style={{ width:"100%", height:"100%", position:"absolute", inset:0 }}>
                    <img
                      src={item.photo.url}
                      alt={item.photo.alt}
                      style={{
                        width:"100%", height:"100%",
                        objectFit:"cover",
                        display:"block",
                        filter:"brightness(0.85) contrast(1.1) saturate(0.9)"
                      }}
                      onError={e => { e.target.style.display="none"; }}
                    />
                  </div>
                  <div className="gallery-fire-overlay"/>
                  {/* Label overlay */}
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0,
                    background:"linear-gradient(transparent, rgba(0,0,0,0.85))",
                    padding:"20px 16px 12px",
                    display:"flex", justifyContent:"space-between", alignItems:"flex-end"
                  }}>
                    <div>
                      <div className="mono" style={{ fontSize:"0.6rem", color:"var(--amber)", letterSpacing:"0.2em", marginBottom:2 }}>
                        {item.tag}
                      </div>
                      <div style={{ fontFamily:"Inter", fontWeight:900, fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        {item.label}
                      </div>
                    </div>
                    <div style={{ color:"var(--burn)", fontFamily:"Inter", fontWeight:700, fontSize:"0.8rem" }}>
                      {item.price}
                    </div>
                  </div>
                  {/* Top right tag */}
                  <div style={{
                    position:"absolute", top:12, right:12,
                    background:"rgba(0,0,0,0.7)", border:"1px solid rgba(255,179,0,0.3)",
                    padding:"2px 8px"
                  }}>
                    <span className="mono" style={{ fontSize:"0.55rem", color:"rgba(255,179,0,0.7)", letterSpacing:"0.15em" }}>
                      AVAILABLE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-line" style={{ margin:"0 40px" }}/>

        {/* ── CUSTOM FORM ── */}
        <section id="custom" style={{ padding:"100px 40px", maxWidth:900, margin:"0 auto" }}>
          <div ref={formRef} className="reveal">
            <div style={{ marginBottom:60 }}>
              <p className="step-number">// SECCIÓN_04 / TU DROP</p>
              <h2 style={{
                fontFamily:"Inter", fontWeight:900, fontSize:"clamp(2rem,5vw,3.5rem)",
                textTransform:"uppercase", letterSpacing:"0.03em", marginTop:8
              }}>
                Haz Tu Drop{" "}
                <span style={{ color:"var(--burn)", textShadow:"0 0 20px rgba(255,69,0,0.4)" }}>Custom</span>
              </h2>
              <p className="mono" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", marginTop:8, lineHeight:1.6 }}>
                Cada pieza es única. Rellena el brief y te contactamos en 24h.
              </p>
            </div>

            {submitted ? (
              <div className="burn-glow" style={{
                border:"1px solid var(--burn)", padding:48, textAlign:"center",
                background:"rgba(255,69,0,0.05)"
              }}>
                <div style={{ fontFamily:"Inter", fontWeight:900, fontSize:"2rem", color:"var(--burn)", marginBottom:12 }}>
                  DROP RECIBIDO ✦
                </div>
                <p className="mono" style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.85rem" }}>
                  Te contactamos en menos de 24h. Prepárate.
                </p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                <div>
                  <label className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.6)", letterSpacing:"0.2em", display:"block", marginBottom:8 }}>
                    NOMBRE / CREW
                  </label>
                  <input className="form-input" placeholder="Tu nombre o nombre del colectivo"
                    value={formData.nombre} onChange={e=>setFormData({...formData,nombre:e.target.value})}/>
                </div>
                <div>
                  <label className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.6)", letterSpacing:"0.2em", display:"block", marginBottom:8 }}>
                    EMAIL
                  </label>
                  <input className="form-input" type="email" placeholder="tu@email.com"
                    value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})}/>
                </div>
                <div>
                  <label className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.6)", letterSpacing:"0.2em", display:"block", marginBottom:8 }}>
                    MEDIDAS (cm)
                  </label>
                  <input className="form-input" placeholder="Ej: 120 × 180 cm"
                    value={formData.medidas} onChange={e=>setFormData({...formData,medidas:e.target.value})}/>
                </div>
                <div>
                  <label className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.6)", letterSpacing:"0.2em", display:"block", marginBottom:8 }}>
                    MATERIAL
                  </label>
                  <select className="form-input" value={formData.material}
                    onChange={e=>setFormData({...formData,material:e.target.value})}>
                    <option value="">Selecciona material</option>
                    <option>Loop-Cut Premium</option>
                    <option>Shaggy Urban</option>
                    <option>Flatweave Graphic</option>
                    <option>Tufted 3D</option>
                  </select>
                </div>
                <div style={{ gridColumn:"span 2" }}>
                  <label className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.6)", letterSpacing:"0.2em", display:"block", marginBottom:8 }}>
                    CONCEPTO / ARTWORK
                  </label>
                  <textarea className="form-input" placeholder="Descríbenos tu visión. Colores, referencias, mood, lo que sea. Sin límites."
                    value={formData.concepto} onChange={e=>setFormData({...formData,concepto:e.target.value})}/>
                </div>
                <div style={{ gridColumn:"span 2", display:"flex", justifyContent:"flex-end" }}>
                  <button className="btn-burn" onClick={handleSubmit} style={{ fontSize:"1rem", padding:"18px 60px" }}>
                    ENVIAR DROP REQUEST →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background:"#0a0a0a", borderTop:"1px solid rgba(255,179,0,0.1)",
          padding:"60px 40px 40px"
        }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:40, marginBottom:60 }}>
              <div>
                <GlitchText text="G-RUGS" style={{
                  fontFamily:"Inter", fontWeight:900, fontSize:"3rem",
                  letterSpacing:"0.05em", display:"block", marginBottom:8,
                  background:"linear-gradient(135deg, #FF4500, #FFB300)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
                }}/>
                <p className="mono" style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.75rem", maxWidth:280, lineHeight:1.7 }}>
                  Arte urbano para tu suelo. No hacemos alfombras, hacemos drops de arte custom. Atrevido, ruidoso, exclusivo.
                </p>
              </div>
              <div style={{ display:"flex", gap:60, flexWrap:"wrap" }}>
                {[
                  { title:"STUDIO", links:["Sobre Nosotros","Colaboraciones","Press Kit","Contacto"] },
                  { title:"DROPS", links:["Colección 2025","Ediciones Limitadas","Archive","Custom"] },
                  { title:"CONNECT", links:["Instagram","TikTok","Newsletter","WhatsApp"] },
                ].map(col => (
                  <div key={col.title}>
                    <div className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,179,0,0.5)", letterSpacing:"0.25em", marginBottom:16 }}>
                      {col.title}
                    </div>
                    {col.links.map(l => (
                      <div key={l} style={{ marginBottom:8 }}>
                        <a href="#" style={{
                          fontFamily:"Inter", fontSize:"0.85rem", color:"rgba(255,255,255,0.4)",
                          textDecoration:"none", transition:"color 0.2s",
                          display:"block"
                        }}
                          onMouseEnter={e=>e.target.style.color="var(--white)"}
                          onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}
                        >{l}</a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="divider-line"/>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:24, flexWrap:"wrap", gap:12 }}>
              <GlitchText text="© 2025 G-RUGS STUDIO. TODOS LOS DERECHOS RESERVADOS." style={{
                fontFamily:"IBM Plex Mono", fontSize:"0.65rem",
                color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em", display:"block"
              }}/>
              <div className="mono" style={{ fontSize:"0.6rem", color:"rgba(255,179,0,0.2)", letterSpacing:"0.15em" }}>
                v2.5.1 · BUILD_URBAN · DROP_READY
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
