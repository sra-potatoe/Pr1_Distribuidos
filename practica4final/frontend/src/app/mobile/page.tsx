// La app móvil ahora es nativa con Expo + React Native, no vive aquí.
// Esta ruta queda como información para el operador.
'use client';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --ink:       #0b0f1a;
    --ink-2:     #111827;
    --ink-3:     #1a2236;
    --glass:     rgba(255,255,255,0.035);
    --rim:       rgba(255,255,255,0.07);
    --rim-2:     rgba(255,255,255,0.12);
    --gold:      #c9a84c;
    --gold-soft: #e8c96b;
    --gold-dim:  rgba(201,168,76,0.12);
    --blue:      #4e9af1;
    --blue-dim:  rgba(78,154,241,0.12);
    --green:     #34d399;
    --green-dim: rgba(52,211,153,0.11);
    --text:      #e8eaf0;
    --text-2:    #9ba3b4;
    --text-3:    #5c6479;
    --r:         10px;
    --r-lg:      16px;
    --tr:        0.2s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--ink); color: var(--text); }

  .mobile-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background:
      radial-gradient(ellipse 70% 50% at 50% -10%, rgba(78,154,241,0.06) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 100% 110%, rgba(52,211,153,0.04) 0%, transparent 60%),
      var(--ink);
  }

  .mobile-root::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue), var(--gold), var(--blue), transparent);
    z-index: 100;
  }

  .mobile-inner {
    width: 100%;
    max-width: 600px;
  }

  /* ── HEADER ── */
  .mob-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .mob-icon-wrap {
    width: 72px; height: 72px;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--blue-dim), var(--gold-dim));
    border: 1px solid rgba(78,154,241,0.22);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    margin: 0 auto 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .mob-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .mob-eyebrow::before, .mob-eyebrow::after {
    content: ''; display: inline-block;
    width: 24px; height: 1px; background: var(--blue); opacity: 0.4;
  }

  .mob-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.9rem; font-weight: 400;
    color: var(--text); letter-spacing: -0.02em;
    line-height: 1.2; margin-bottom: 10px;
  }

  .mob-title em { font-style: italic; color: var(--gold-soft); }

  .mob-lead {
    font-size: 14px; color: var(--text-3); font-weight: 300; line-height: 1.6;
  }

  /* ── STEPS CARD ── */
  .steps-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 24px;
    margin-bottom: 16px;
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }

  .steps-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(78,154,241,0.3), transparent);
  }

  .steps-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-3); margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }

  .steps-label::after {
    content: ''; flex: 1; height: 1px; background: var(--rim);
  }

  /* ── CODE BLOCK ── */
  .code-block {
    background: var(--ink-2);
    border: 1px solid var(--rim);
    border-radius: var(--r);
    padding: 20px;
    overflow-x: auto;
    position: relative;
  }

  .code-block pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    line-height: 1.8;
    color: var(--text-2);
    white-space: pre;
  }

  /* Syntax-lite coloring */
  .code-block .c-comment { color: var(--text-3); }
  .code-block .c-cmd     { color: var(--gold-soft); }
  .code-block .c-string  { color: var(--green); }

  /* ── INFO CARD ── */
  .info-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 20px 22px;
    margin-bottom: 14px;
    display: flex; align-items: flex-start; gap: 14px;
    backdrop-filter: blur(8px);
    transition: var(--tr);
  }

  .info-card:hover { border-color: var(--rim-2); }

  .info-card-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }

  .info-card-title {
    font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 4px;
  }

  .info-card-body {
    font-size: 12.5px; color: var(--text-3); line-height: 1.55;
  }

  /* ── CODE INLINE ── */
  code {
    font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
    background: var(--ink-3); border: 1px solid var(--rim);
    padding: 2px 7px; border-radius: 5px; color: var(--text-2);
  }

  /* ── LINK ── */
  .nav-link {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 20px;
    background: linear-gradient(135deg, rgba(201,168,76,0.14), rgba(78,154,241,0.1));
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 10px;
    color: var(--gold-soft);
    font-size: 13.5px; font-weight: 600;
    text-decoration: none;
    transition: var(--tr);
    font-family: 'DM Sans', sans-serif;
  }

  .nav-link:hover {
    background: linear-gradient(135deg, rgba(201,168,76,0.22), rgba(78,154,241,0.16));
    box-shadow: 0 4px 16px rgba(201,168,76,0.12);
    transform: translateY(-1px);
  }

  .footer-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 20px; flex-wrap: wrap; gap: 12px;
  }

  .footer-note {
    font-size: 12.5px; color: var(--text-3);
    display: flex; align-items: center; gap: 7px;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

const CODE = `# 1. En tu PC
cd mobile-app
npm install

# 2. Edita .env con tu IP local
ipconfig | findstr IPv4              # Windows
# Pega esa IP en mobile-app/.env:
# EXPO_PUBLIC_API_BASE_URL=http://TU_IP:3001

# 3. Arranca el dev server
npx expo start

# 4. En tu celular: instala "Expo Go" desde Play Store / App Store
# 5. Escanea el QR que sale en la terminal de tu PC`;

export default function MobileMoved() {
    return (
        <>
            <style>{styles}</style>
            <div className="mobile-root">
                <div className="mobile-inner">

                    {/* HEADER */}
                    <div className="mob-header">
                        <div className="mob-icon-wrap">📱</div>
                        <div className="mob-eyebrow">App Nativa</div>
                        <h1 className="mob-title">App móvil con <em>Expo</em></h1>
                        <p className="mob-lead">
                            La aplicación de captura de actas es una app nativa para Android e iOS.
                            Se prueba con Expo Go escaneando un QR.
                        </p>
                    </div>

                    {/* INFO CARDS */}
                    <div className="info-card">
                        <div className="info-card-icon" style={{ background: 'rgba(78,154,241,0.12)' }}>⚙️</div>
                        <div>
                            <div className="info-card-title">Requisitos</div>
                            <div className="info-card-body">
                                Node.js instalado en tu PC · Celular con Expo Go (Play Store / App Store) · Ambos en la misma red WiFi
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-icon" style={{ background: 'rgba(52,211,153,0.11)' }}>🌐</div>
                        <div>
                            <div className="info-card-title">Variable de entorno</div>
                            <div className="info-card-body">
                                Configura tu IP local en <code>mobile-app/.env</code> como{' '}
                                <code>EXPO_PUBLIC_API_BASE_URL=http://TU_IP:3001</code>
                            </div>
                        </div>
                    </div>

                    {/* STEPS */}
                    <div className="steps-card">
                        <div className="steps-label">Cómo arrancarla</div>
                        <div className="code-block">
                            <pre>{CODE}</pre>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="footer-row">
                        <div className="footer-note">
                            📄 Documentación completa en <code>mobile-app/README.md</code>
                        </div>
                        <a href="/sms-admin" className="nav-link">
                            Ir a Administración de SMS →
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}