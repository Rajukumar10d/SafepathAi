'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ShieldAlert,
    Home,
    Map,
    ShieldCheck,
    AlertTriangle,
    LogOut,
    User,
    BarChart3,
    ClipboardList
} from 'lucide-react';
import styles from './layout.module.css';
import Chatbot from '@/components/Chatbot';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: Home },
        { name: 'AI Safety Check', path: '/dashboard/predict', icon: ShieldCheck },
        { name: 'Live Map', path: '/dashboard/map', icon: Map },
        { name: 'Reports', path: '/dashboard/reports', icon: ClipboardList },
        { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Emergency', path: '/dashboard/emergency', icon: AlertTriangle },
    ];

    return (
        <div className={styles.dashboardLayout}>
            <aside className={styles.sidebar}>
                <Link href="/" className={styles.logo}>
                    <ShieldAlert className={styles.logoIcon} size={24} />
                    <span>SafePath AI</span>
                </Link>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    Log Out
                </button>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>J</div>
                        <span>Jane Doe</span>
                    </div>
                </header>

                {children}
            </main>
            <Chatbot />
        </div>
    );
}
