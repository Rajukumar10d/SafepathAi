'use client';

import { Users, Activity, ShieldAlert, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

export default function AdminDashboard() {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Link href="/" className={styles.logo}>
                    <ShieldAlert size={24} />
                    SafePath Admin
                </Link>
                <nav className={styles.nav}>
                    <div className={`${styles.navLink} ${styles.active}`}>
                        <BarChart3 size={20} /> Dashboard
                    </div>
                    <div className={styles.navLink}>
                        <Users size={20} /> Users
                    </div>
                    <div className={styles.navLink}>
                        <Activity size={20} /> System Logs
                    </div>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={`${styles.title} animate-fade-in`}>Admin Overview</h1>
                    <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                        System statistics and community safety insights.
                    </p>
                </div>

                <div className={styles.statsGrid}>
                    <GlassCard className={`${styles.statCard} animate-fade-in delay-100`}>
                        <div className={styles.statHeader}>
                            Total Users
                            <Users size={20} color="var(--primary)" />
                        </div>
                        <div className={styles.statValue}>12,458</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            <TrendingUp size={16} /> +12% this week
                        </div>
                    </GlassCard>

                    <GlassCard className={`${styles.statCard} animate-fade-in delay-200`}>
                        <div className={styles.statHeader}>
                            Safety Checks
                            <Activity size={20} color="var(--accent)" />
                        </div>
                        <div className={styles.statValue}>45,892</div>
                        <div className={`${styles.statChange} ${styles.positive}`}>
                            <TrendingUp size={16} /> +24% this week
                        </div>
                    </GlassCard>

                    <GlassCard className={`${styles.statCard} animate-fade-in delay-300`}>
                        <div className={styles.statHeader}>
                            Active SOS Alerts
                            <AlertTriangle size={20} color="var(--danger)" />
                        </div>
                        <div className={styles.statValue}>3</div>
                        <div className={`${styles.statChange} ${styles.negative}`}>
                            Resolving...
                        </div>
                    </GlassCard>
                </div>

                <div className={styles.chartsGrid}>
                    <GlassCard className={`${styles.chartCard} animate-fade-in delay-200`}>
                        <h3 className={styles.chartTitle}><BarChart3 size={20} /> Risk Assessment Trends</h3>
                        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingTop: '20px' }}>
                            {/* Fake Bar Chart */}
                            {[40, 60, 45, 80, 50, 70, 90].map((h, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                                    height: `${h}%`,
                                    borderRadius: '4px 4px 0 0',
                                    opacity: 0.8
                                }}></div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className={`${styles.chartCard} animate-fade-in delay-300`}>
                        <h3 className={styles.chartTitle}><ShieldAlert size={20} /> Top High-Risk Zones</h3>
                        <div className={styles.list}>
                            <div className={styles.listItem}>
                                <span>Downtown Alley 4</span>
                                <span style={{ color: 'var(--danger)' }}>High</span>
                            </div>
                            <div className={styles.listItem}>
                                <span>North Station</span>
                                <span style={{ color: 'var(--warning)' }}>Medium</span>
                            </div>
                            <div className={styles.listItem}>
                                <span>West End Park</span>
                                <span style={{ color: 'var(--warning)' }}>Medium</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
