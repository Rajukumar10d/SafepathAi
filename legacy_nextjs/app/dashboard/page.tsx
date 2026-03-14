import Link from 'next/link';
import { ShieldCheck, Map, Clock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

export default function DashboardOverview() {
    const recentChecks = [
        { id: 1, source: 'World Trade Park', dest: 'SKIT College, Jaipur', time: '10:30 PM', status: 'Safe', risk: 15 },
        { id: 2, source: 'MI Road', dest: 'Bapu Bazar', time: '8:45 PM', status: 'Medium', risk: 45 },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${styles.welcome} animate-up`}>
                    SafePath <span className="shimmer-text">Dashboard</span>
                </h1>
                <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                    Real-time monitoring and predictive safety analysis active.
                </p>
            </div>

            <div className={styles.grid}>
                <GlassCard className={`${styles.card} animate-up`} style={{ animationDelay: '200ms' }}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <ShieldCheck size={28} />
                        </div>
                        Safety AI Engine
                    </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>
                        Our multi-layer AI analyzes crime patterns, lighting data, and community reports to suggest the most secure path.
                    </p>
                    <Link href="/dashboard/predict" className={`btn btn-primary ${styles.actionBtn}`}>
                        Start Safety Analysis
                    </Link>
                </GlassCard>

                <GlassCard className={`${styles.card} animate-up`} style={{ animationDelay: '300ms' }}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <Map size={28} />
                        </div>
                        Secure Network Map
                    </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>
                        Access the live community safety layer. View well-lit routes, police presence, and verified safety zones.
                    </p>
                    <Link href="/dashboard/map" className={`btn btn-primary ${styles.actionBtn}`}>
                        View Secure Routes
                    </Link>
                </GlassCard>
            </div>

            <div className="animate-up" style={{ animationDelay: '400ms' }}>
                <div className={styles.cardHeader} style={{ marginBottom: '20px' }}>
                    <div className={`${styles.cardIcon}`}>
                        <Clock size={28} />
                    </div>
                    Recent Safety Audits
                </div>

                <div className={styles.historyList}>
                    {recentChecks.map((check) => (
                        <div key={check.id} className={styles.historyItem}>
                            <div className={styles.routeInfo}>
                                <span className={styles.routeLoc}>{check.source} → {check.dest}</span>
                                <span className={styles.routeTime}>Verified at {check.time}</span>
                            </div>
                            <div className={check.status === 'Safe' ? styles.statusSafe : styles.statusMedium}>
                                {check.status} &bull; {100 - check.risk}% Security
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
