import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <ShieldAlert className={styles.logoIcon} size={28} />
                        <span>SafePath AI</span>
                    </div>
                    <p className={styles.desc}>
                        Intelligent women safety navigation system powered by live AI risk prediction and emergency networking.
                    </p>
                </div>

                <div className={styles.linksSection}>
                    <div className={styles.linkGroup}>
                        <h4>Platform</h4>
                        <Link href="/dashboard/predict">Safety Check</Link>
                        <Link href="/dashboard/map">Live Map</Link>
                        <Link href="/dashboard/emergency">Alerts</Link>
                    </div>
                    <div className={styles.linkGroup}>
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="#">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p>&copy; {new Date().getFullYear()} SafePath AI. Empowering safe navigation.</p>
            </div>
        </footer>
    );
}
