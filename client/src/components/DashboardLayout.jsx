import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    ShieldAlert,
    Home,
    Map,
    ShieldCheck,
    AlertTriangle,
    LogOut,
    BarChart3,
    ClipboardList
} from 'lucide-react';
import styles from './DashboardLayout.module.css';
import Chatbot from '../components/Chatbot';

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
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
                <Link to="/" className={styles.logo}>
                    <ShieldAlert className={styles.logoIcon} size={24} />
                    <span>SafePath AI</span>
                </Link>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>J</div>
                        <span>Jane Doe</span>
                    </div>
                </header>

                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </main>
            <Chatbot />
        </div>
    );
}
