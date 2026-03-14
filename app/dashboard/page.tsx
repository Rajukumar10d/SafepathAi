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
                    Welcome back, <span>Jane</span>
                </h1>
                <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                    Your intelligent safety network is active and monitoring your surroundings.
                </p>
            </div>

            <div className={styles.grid}>
                <GlassCard className={`${styles.card} animate-up`} style={{ animationDelay: '200ms' }}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <ShieldCheck size={28} />
                        </div>
                        Safety AI
                    </div>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        Planning a trip? Let our advanced AI analyze the safest route for you right now using real-time data.
                    </p>
                    <Link href="/dashboard/predict" className={`btn btn-primary ${styles.actionBtn}`}>
                        Run Safety Check
                    </Link>
                </GlassCard>

                <GlassCard className={`${styles.card} animate-up`} style={{ animationDelay: '300ms' }}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <Map size={28} />
                        </div>
                        Live Network
                    </div>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        Access the real-time community map with predictive safety overlays and active emergency reports.
                    </p>
                    <Link href="/dashboard/map" className={`btn btn-primary ${styles.actionBtn}`}>
                        Open Live Map
                    </Link>
                </GlassCard>
            </div>

            <GlassCard className="animate-up" style={{ animationDelay: '400ms' }}>
                <div className={styles.cardHeader}>
                    <div className={`${styles.cardIcon}`}>
                        <Clock size={28} />
                    </div>
                    Safety History
                </div>

                <div className={styles.historyList}>
                    {recentChecks.map((check) => (
                        <div key={check.id} className={styles.historyItem}>
                            <div className={styles.routeInfo}>
                                <span className={styles.routeLoc}>{check.source} → {check.dest}</span>
                                <span className={styles.routeTime}>{check.time}</span>
                            </div>
                            <div className={check.status === 'Safe' ? styles.statusSafe : styles.statusMedium}>
                                {check.status} ({100 - check.risk}% Secure)
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
