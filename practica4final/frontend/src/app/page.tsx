'use client';

import Link from 'next/link';
import {
    BarChart3, FileSpreadsheet, MessageSquare, Smartphone,
    ArrowRight, Activity, Zap, ScrollText, Server, Shield,
    ChevronRight
} from 'lucide-react';

const cards = [
    {
        href: '/dashboard',
        title: 'Dashboard analítico',
        desc: 'Visualizaciones en tiempo real con 3 métricas (Oficial, Rápido y Combinado), mapa de calor, ganador territorial y horarios.',
        icon: BarChart3,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        glow: 'rgba(99,102,241,0.35)',
        tag: 'Tiempo real',
        tagColor: '#818cf8',
    },
    {
        href: '/rrv',
        title: 'Cómputo Rápido (RRV)',
        desc: 'Pipeline rápido — actas desde PDF, SMS y N8N. Aprobar, observar o rechazar en tiempo real.',
        icon: Zap,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        glow: 'rgba(245,158,11,0.35)',
        tag: 'Pipeline',
        tagColor: '#fbbf24',
    },
    {
        href: '/oficial',
        title: 'Cómputo Oficial',
        desc: 'Transcripción manual de actas, gestión CRUD de actas y mesas electorales.',
        icon: FileSpreadsheet,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        glow: 'rgba(16,185,129,0.35)',
        tag: 'Gestión',
        tagColor: '#34d399',
    },
    {
        href: '/auditoria',
        title: 'Auditoría',
        desc: 'Línea de tiempo unificada de todos los eventos: Oficial, RRV, SMS y errores del sistema.',
        icon: ScrollText,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        glow: 'rgba(168,85,247,0.35)',
        tag: 'Eventos',
        tagColor: '#c084fc',
    },
    {
        href: '/cluster',
        title: 'Estado del Clúster',
        desc: '3 nodos PostgreSQL (primary + 2 standbys) y MongoDB replica set. Test de replicación en vivo.',
        icon: Server,
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
        glow: 'rgba(6,182,212,0.35)',
        tag: 'Infraestructura',
        tagColor: '#22d3ee',
    },
    {
        href: '/sms-admin',
        title: 'Administración SMS',
        desc: 'Lista blanca de números, simulador de SMS y auditoría completa de mensajes recibidos.',
        icon: MessageSquare,
        gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
        glow: 'rgba(249,115,22,0.35)',
        tag: 'SMS',
        tagColor: '#fb923c',
    },
];

export default function Home() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .snce-root {
                    min-height: 100vh;
                    background: #080c14;
                    color: #e2e8f0;
                    font-family: 'DM Sans', sans-serif;
                    overflow-x: hidden;
                    position: relative;
                }

                /* ── Fondo decorativo ── */
                .snce-root::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(251,191,36,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 50% at 90% 80%, rgba(99,102,241,0.07) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 60% at 10% 100%, rgba(16,185,129,0.05) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Grid de puntos */
                .snce-root::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 32px 32px;
                    pointer-events: none;
                    z-index: 0;
                }

                .snce-wrap {
                    position: relative;
                    z-index: 1;
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 32px 80px;
                }

                /* ── Navbar ── */
                .snce-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 28px 0 0;
                    margin-bottom: 80px;
                    animation: fadeDown .6s ease both;
                }
                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }
                .nav-brand-icon {
                    width: 36px; height: 36px;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1c1917;
                    flex-shrink: 0;
                    box-shadow: 0 0 20px rgba(251,191,36,0.4);
                }
                .nav-brand-text {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 15px;
                    color: #f1f5f9;
                    letter-spacing: -0.2px;
                }
                .nav-brand-text span {
                    color: #fbbf24;
                }
                .nav-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 100px;
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #94a3b8;
                    backdrop-filter: blur(12px);
                }
                .nav-pill-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 8px #10b981;
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .7; transform: scale(1.3); }
                }

                /* ── Hero ── */
                .snce-hero {
                    text-align: center;
                    max-width: 820px;
                    margin: 0 auto 88px;
                    animation: fadeUp .7s ease both .1s;
                }
                .hero-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(251,191,36,0.1);
                    border: 1px solid rgba(251,191,36,0.25);
                    border-radius: 100px;
                    padding: 6px 18px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #fbbf24;
                    letter-spacing: .8px;
                    text-transform: uppercase;
                    margin-bottom: 28px;
                }
                .hero-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(38px, 5.5vw, 72px);
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -2px;
                    color: #f8fafc;
                    margin-bottom: 24px;
                }
                .hero-title em {
                    font-style: normal;
                    background: linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #fbbf24 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }
                @keyframes shimmer {
                    from { background-position: 0% center; }
                    to { background-position: 200% center; }
                }
                .hero-sub {
                    font-size: 18px;
                    font-weight: 300;
                    color: #94a3b8;
                    line-height: 1.7;
                    max-width: 600px;
                    margin: 0 auto 44px;
                }
                .hero-cta {
                    display: flex;
                    gap: 14px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: #1c1917;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 600;
                    font-size: 15px;
                    padding: 14px 28px;
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all .2s ease;
                    box-shadow: 0 4px 24px rgba(251,191,36,0.35);
                    position: relative;
                    overflow: hidden;
                }
                .btn-primary::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
                    opacity: 0;
                    transition: opacity .2s;
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(251,191,36,0.5); }
                .btn-primary:hover::after { opacity: 1; }
                .btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: #e2e8f0;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                    font-size: 15px;
                    padding: 14px 28px;
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all .2s ease;
                    backdrop-filter: blur(12px);
                }
                .btn-ghost:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.2);
                    transform: translateY(-2px);
                }

                /* ── Divisor stats ── */
                .snce-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 80px;
                    animation: fadeUp .7s ease both .2s;
                }
                .stat-item {
                    background: rgba(255,255,255,0.025);
                    padding: 28px 32px;
                    text-align: center;
                    transition: background .2s;
                }
                .stat-item:hover { background: rgba(255,255,255,0.05); }
                .stat-num {
                    font-family: 'Syne', sans-serif;
                    font-size: 36px;
                    font-weight: 800;
                    color: #f8fafc;
                    letter-spacing: -1.5px;
                    display: block;
                }
                .stat-num em {
                    font-style: normal;
                    color: #fbbf24;
                }
                .stat-label {
                    font-size: 13px;
                    color: #64748b;
                    font-weight: 400;
                    margin-top: 4px;
                    display: block;
                }

                /* ── Sección título ── */
                .section-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 32px;
                    animation: fadeUp .7s ease both .3s;
                }
                .section-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                }
                .section-label-text {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #475569;
                }

                /* ── Grid de cards ── */
                .snce-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 48px;
                    animation: fadeUp .7s ease both .35s;
                }
                @media (max-width: 1024px) { .snce-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px) { .snce-grid { grid-template-columns: 1fr; } .snce-stats { grid-template-columns: 1fr; } }

                .snce-card {
                    display: flex;
                    flex-direction: column;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 22px;
                    padding: 28px;
                    text-decoration: none;
                    color: inherit;
                    position: relative;
                    overflow: hidden;
                    transition: transform .25s ease, border-color .25s ease, background .25s ease;
                    cursor: pointer;
                }
                .snce-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--card-glow);
                    opacity: 0;
                    transition: opacity .3s ease;
                    border-radius: inherit;
                }
                .snce-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.055);
                }
                .snce-card:hover::before { opacity: 1; }

                /* Línea superior con gradiente */
                .snce-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 24px; right: 24px;
                    height: 1px;
                    background: var(--card-gradient);
                    opacity: .6;
                    border-radius: 0 0 4px 4px;
                    transition: opacity .3s;
                }
                .snce-card:hover::after { opacity: 1; left: 0; right: 0; }

                .card-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 22px;
                }
                .card-icon-wrap {
                    width: 48px; height: 48px;
                    border-radius: 14px;
                    background: var(--card-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    box-shadow: 0 6px 20px var(--card-glow);
                    flex-shrink: 0;
                }
                .card-tag {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                    color: var(--card-tag-color);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 4px 10px;
                    border-radius: 100px;
                }
                .card-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 18px;
                    font-weight: 700;
                    color: #f1f5f9;
                    letter-spacing: -.4px;
                    margin-bottom: 10px;
                    line-height: 1.25;
                }
                .card-desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.65;
                    flex: 1;
                    margin-bottom: 24px;
                }
                .card-footer {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--card-tag-color);
                    margin-top: auto;
                    transition: gap .2s ease;
                }
                .snce-card:hover .card-footer { gap: 10px; }

                /* ── Info banner ── */
                .snce-info {
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 18px;
                    padding: 22px 28px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    animation: fadeUp .7s ease both .5s;
                }
                .info-icon {
                    width: 44px; height: 44px;
                    background: rgba(251,191,36,0.12);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fbbf24;
                    flex-shrink: 0;
                }
                .info-text strong {
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    color: #e2e8f0;
                    display: block;
                    margin-bottom: 2px;
                }
                .info-text p {
                    font-size: 13px;
                    color: #64748b;
                    line-height: 1.5;
                }
                .info-text code {
                    background: rgba(251,191,36,0.1);
                    color: #fbbf24;
                    padding: 1px 6px;
                    border-radius: 5px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 12px;
                }

                /* ── Footer ── */
                .snce-footer {
                    margin-top: 80px;
                    padding-top: 28px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    animation: fadeUp .7s ease both .6s;
                }
                .footer-brand {
                    font-family: 'Syne', sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    color: #334155;
                    letter-spacing: -.2px;
                }
                .footer-brand span { color: #475569; font-weight: 400; }
                .footer-shield {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #334155;
                }

                /* ── Keyframes ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="snce-root">
                <div className="snce-wrap">

                    {/* Navbar */}
                    <nav className="snce-nav">
                       
                    </nav>

                    {/* Hero */}
                    <section className="snce-hero">
                        <span className="hero-eyebrow">
                            <Shield size={12} />
                            Plataforma electoral distribuida
                        </span>
                        <h1 className="hero-title">
                            Sistema Nacional de<br />
                            <em>Cómputo Electoral</em>
                        </h1>
                        <p className="hero-sub">
                            Pipeline RRV y Cómputo Oficial integrados con OCR, SMS, PDF
                            y dashboard analítico en tiempo real.
                        </p>
                        <div className="hero-cta">
                            <Link href="/dashboard" className="btn-primary">
                                Ir al Dashboard <ArrowRight size={16} />
                            </Link>
                            <Link href="/oficial" className="btn-ghost">
                                Cómputo Oficial <ChevronRight size={15} />
                            </Link>
                        </div>
                    </section>

                    {/* Stats */}
                    <div className="snce-stats">
                        <div className="stat-item">
                            <span className="stat-num">3<em>+</em></span>
                            <span className="stat-label">Nodos PostgreSQL activos</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-num"><em>∞</em></span>
                            <span className="stat-label">Actas procesadas en tiempo real</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-num">6</span>
                            <span className="stat-label">Módulos del sistema</span>
                        </div>
                    </div>

                    {/* Cards section */}
                    <div className="section-label">
                        <span className="section-line" />
                        <span className="section-label-text">Módulos del sistema</span>
                        <span className="section-line" />
                    </div>

                    <div className="snce-grid">
                        {cards.map(({ href, title, desc, icon: Icon, gradient, glow, tag, tagColor }) => (
                            <Link
                                key={href}
                                href={href}
                                className="snce-card"
                                style={{
                                    '--card-gradient': gradient,
                                    '--card-glow': `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)`,
                                    '--card-tag-color': tagColor,
                                } as React.CSSProperties}
                            >
                                <div className="card-head">
                                    <div className="card-icon-wrap">
                                        <Icon size={22} />
                                    </div>
                                    <span className="card-tag">{tag}</span>
                                </div>
                                <h3 className="card-title">{title}</h3>
                                <p className="card-desc">{desc}</p>
                                <span className="card-footer">
                                    Abrir módulo <ArrowRight size={14} />
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Info banner */}
                    <div className="snce-info">
                        <div className="info-icon">
                            <Smartphone size={20} />
                        </div>
                        <div className="info-text">
                            <strong>Carga de PDFs desde dispositivo móvil</strong>
                            <p>
                                La captura de actas usa Expo + React Native.
                                Ver instrucciones en <code>mobile-app/README.md</code>.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="snce-footer">
                        <span className="footer-brand">
                            SNCE <span>— Sistema Nacional de Cómputo Electoral</span>
                        </span>
                        <span className="footer-shield">
                            <Shield size={13} />
                            Sistemas Distribuidos · Práctica 4
                        </span>
                    </footer>

                </div>
            </div>
        </>
    );
} 