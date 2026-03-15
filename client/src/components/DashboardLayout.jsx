import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    ShieldAlert,
    Home,
    Map,
    ShieldCheck,
    AlertTriangle,
    LogOut,
    BarChart3,
    ClipboardList,
    Menu,
    X
} from 'lucide-react';
import styles from './DashboardLayout.module.css';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
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

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0b10', color: 'white' }}>Loading Dashboard...</div>;
    }

    return (
        <div className={styles.dashboardLayout}>
            {/* Mobile menu toggle */}
            <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Overlay backdrop for mobile */}
            {mobileMenuOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
                <Link to="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
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
                                onClick={() => setMobileMenuOpen(false)}
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
                        <div className={styles.avatar}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>{user?.name || 'Guest User'}</span>
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
