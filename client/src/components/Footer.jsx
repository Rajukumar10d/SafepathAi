import { Link } from 'react-router-dom';
import { ShieldAlert, Twitter, Instagram, Github } from 'lucide-react';
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
                        The ultimate AI-powered safety navigation system for women. 
                        Protecting lives through predictive intelligence and community networking.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon}><Twitter size={18} /></a>
                        <a href="#" className={styles.socialIcon}><Instagram size={18} /></a>
                        <a href="#" className={styles.socialIcon}><Github size={18} /></a>
                    </div>
                </div>

                <div className={styles.linkGroup}>
                    <h4>Platform</h4>
                    <Link to="/dashboard/predict">AI Safety Check</Link>
                    <Link to="/dashboard/map">Community Map</Link>
                    <Link to="/dashboard/emergency">SOS Center</Link>
                    <Link to="/dashboard/reports">Safety Reports</Link>
                </div>

                <div className={styles.linkGroup}>
                    <h4>Company</h4>
                    <Link to="/about">Our Mission</Link>
                    <Link to="/contact">Support</Link>
                    <Link to="#">Privacy Policy</Link>
                    <Link to="#">Terms of Service</Link>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p>&copy; {new Date().getFullYear()} SafePath AI. Built for the future of safety.</p>
            </div>
        </footer>
    );
}
