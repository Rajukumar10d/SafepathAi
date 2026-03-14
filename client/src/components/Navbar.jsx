import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <Link to="/" className={styles.logo}>
                <div className={styles.iconWrapper}>
                    <ShieldAlert className={styles.logoIcon} size={28} />
                </div>
                <span>SafePath <span className="shimmer-text">AI</span></span>
            </Link>

            <div className={`${styles.navLinks} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <div className={styles.mobileActions}>
                    <Link to="/login" className={`${styles.loginBtn} btn`}>Log In</Link>
                    <Link to="/login?signup=true" className={`${styles.signupBtn} btn`}>Sign Up</Link>
                </div>
            </div>

            <div className={styles.desktopActions}>
                <Link to="/login" className={styles.navLink} style={{ marginRight: '1rem' }}>
                    Log In
                </Link>
                <Link to="/login?signup=true" className={`${styles.signupBtn} btn`}>
                    Sign Up
                </Link>
            </div>

            <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </nav>
    );
}
