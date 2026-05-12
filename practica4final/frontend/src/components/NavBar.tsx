'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    FileSpreadsheet,
    MessageSquare,
    Vote,
    Zap,
    Server,
    ScrollText,
    Activity,
} from 'lucide-react';

const links = [
    { href: '/dashboard',  label: 'Dashboard',       icon: BarChart3,     accent: '#818cf8' },
    { href: '/rrv',        label: 'Cómputo Rápido',  icon: Zap,           accent: '#fbbf24' },
    { href: '/oficial',    label: 'Cómputo Oficial',  icon: FileSpreadsheet, accent: '#34d399' },
    { href: '/auditoria',  label: 'Auditoría',        icon: ScrollText,    accent: '#c084fc' },
    { href: '/cluster',    label: 'Clúster',          icon: Server,        accent: '#22d3ee' },
    { href: '/sms-admin',  label: 'SMS',              icon: MessageSquare, accent: '#fb923c' },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

                .snce-nav-root {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    width: 100%;
                    font-family: 'DM Sans', sans-serif;
                }

                /* ── Glass bar ── */
                .snce-nav-bar {
                    background: rgba(8, 12, 20, 0.85);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
                    box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.4);
                    position: relative;
                }

                /* Línea dorada superior */
                .snce-nav-bar::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg,
                        transparent 0%,
                        rgba(251,191,36,0.4) 20%,
                        rgba(251,191,36,0.7) 50%,
                        rgba(251,191,36,0.4) 80%,
                        transparent 100%
                    );
                }

                .snce-nav-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 28px;
                    height: 68px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                /* ── Logo ── */
                .snce-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    flex-shrink: 0;
                    transition: opacity 0.2s ease;
                }
                .snce-logo:hover { opacity: 0.85; }

                .snce-logo-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 13px;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1c1917;
                    flex-shrink: 0;
                    box-shadow:
                        0 0 0 1px rgba(251,191,36,0.3),
                        0 4px 20px rgba(251,191,36,0.25),
                        inset 0 1px 0 rgba(255,255,255,0.3);
                    position: relative;
                    overflow: hidden;
                }
                .snce-logo-icon::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
                    border-radius: inherit;
                }

                .snce-logo-text {
                    line-height: 1.2;
                }
                .snce-logo-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 17px;
                    font-weight: 800;
                    color: #f8fafc;
                    letter-spacing: -0.5px;
                    display: block;
                }
                .snce-logo-sub {
                    font-size: 11px;
                    font-weight: 400;
                    color: #475569;
                    display: block;
                    letter-spacing: 0.1px;
                }

                /* ── Nav links ── */
                .snce-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    background: rgba(255, 255, 255, 0.035);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 16px;
                    padding: 5px;
                    flex: 1;
                    max-width: 760px;
                    justify-content: center;
                }

                @media (max-width: 1024px) {
                    .snce-nav-links { display: none; }
                }

                .snce-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 8px 14px;
                    border-radius: 11px;
                    font-size: 13px;
                    font-weight: 500;
                    text-decoration: none;
                    color: #475569;
                    transition: all 0.2s ease;
                    position: relative;
                    white-space: nowrap;
                    letter-spacing: -0.1px;
                }

                .snce-nav-link:hover {
                    color: #94a3b8;
                    background: rgba(255, 255, 255, 0.06);
                }

                .snce-nav-link.active {
                    color: #f1f5f9;
                    background: rgba(255, 255, 255, 0.09);
                    box-shadow:
                        0 1px 0 rgba(255,255,255,0.08) inset,
                        0 -1px 0 rgba(0,0,0,0.2) inset,
                        0 2px 8px rgba(0,0,0,0.25);
                }

                /* Punto de color activo */
                .snce-nav-link.active::before {
                    content: '';
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: var(--link-accent);
                    box-shadow: 0 0 8px var(--link-accent);
                }

                .snce-nav-link-icon {
                    transition: transform 0.2s ease;
                    flex-shrink: 0;
                    color: var(--link-icon-color, currentColor);
                }

                .snce-nav-link.active .snce-nav-link-icon {
                    color: var(--link-accent);
                }

                .snce-nav-link:hover .snce-nav-link-icon {
                    transform: scale(1.1);
                }
                .snce-nav-link.active .snce-nav-link-icon {
                    transform: scale(1.05);
                }

                /* ── Status badge ── */
                .snce-nav-status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    background: rgba(16, 185, 129, 0.08);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 100px;
                    padding: 7px 14px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #34d399;
                    flex-shrink: 0;
                    cursor: default;
                    user-select: none;
                }
                .snce-status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 8px #10b981;
                    animation: nav-pulse 2.2s ease-in-out infinite;
                }
                @keyframes nav-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.35); }
                }

                /* ── Mobile hamburger (placeholder) ── */
                .snce-nav-mobile-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .snce-nav-mobile-btn:hover { background: rgba(255,255,255,0.1); }

                @media (max-width: 1024px) {
                    .snce-nav-mobile-btn { display: flex; }
                    .snce-nav-status { display: none; }
                }
            `}</style>

            <header className="snce-nav-root">
                <div className="snce-nav-bar">
                    <div className="snce-nav-inner">

                        {/* Logo */}
                        <Link href="/" className="snce-logo">
                            <div className="snce-logo-icon">
                                <Vote size={20} />
                            </div>
                            <div className="snce-logo-text">
                                <span className="snce-logo-name">OEP</span>
                                <span className="snce-logo-sub">Cómputo Electoral Plurinacional</span>
                            </div>
                        </Link>

                        {/* Links */}
                        <nav className="snce-nav-links" aria-label="Navegación principal">
                            {links.map(({ href, label, icon: Icon, accent }) => {
                                const active = pathname === href || pathname?.startsWith(href + '/');
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`snce-nav-link${active ? ' active' : ''}`}
                                        style={{
                                            '--link-accent': accent,
                                            '--link-icon-color': active ? accent : undefined,
                                        } as React.CSSProperties}
                                        aria-current={active ? 'page' : undefined}
                                    >
                                        <Icon size={15} className="snce-nav-link-icon" />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Status + mobile */}
                        <div className="snce-nav-status">
                            <span className="snce-status-dot" />
                            En vivo
                        </div>

                        <button className="snce-nav-mobile-btn" aria-label="Menú">
                            <Activity size={18} />
                        </button>

                    </div>
                </div>
            </header>
        </>
    );
}