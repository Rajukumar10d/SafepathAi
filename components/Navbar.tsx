import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                <ShieldAlert className={styles.logoIcon} size={28} />
                <span>SafePath AI</span>
            </Link>

            <div className={styles.navLinks}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/about" className={styles.navLink}>About</Link>
                <Link href="/contact" className={styles.navLink}>Contact</Link>
            </div>

            <div className={styles.actions}>
                <Link href="/login" className={`${styles.loginBtn} btn`}>
                    Log In
                </Link>
                <Link href="/login?signup=true" className={`${styles.signupBtn} btn`}>
                    Sign Up
                </Link>
            </div>
        </nav>
    );
}
