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
            <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
                <div className={styles.iconWrapper}>
                    <ShieldAlert className={styles.logoIcon} size={28} />
                </div>
                <span>SafePath <span className="shimmer-text">AI</span></span>
            </Link>

            {/* Desktop Navigation Links (Center) */}
            <div className={styles.navLinks}>
                <Link to="/" className={styles.navLink}>Home</Link>
                <Link to="/about" className={styles.navLink}>About</Link>
                <Link to="/contact" className={styles.navLink}>Contact</Link>
            </div>

            {/* Desktop Action Buttons (Right) */}
            <div className={styles.desktopActions}>
                <Link to="/login" className={styles.navLink}>Log In</Link>
                <Link to="/login?signup=true" className={`${styles.signupBtn} btn btn-primary`}>Sign Up</Link>
            </div>

            {/* Mobile Menu Button */}
            <button className={styles.menuToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Sidebar Overlay */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <div className={styles.mobileLinks}>
                    <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <div className={styles.mobileActions}>
                        <Link to="/login" className={`${styles.mobileBtn} btn`} onClick={() => setIsMenuOpen(false)}>Log In</Link>
                        <Link to="/login?signup=true" className={`${styles.mobileBtn} btn btn-primary`} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
