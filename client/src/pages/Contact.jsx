import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PremiumBackground from '../components/PremiumBackground';
import GlassCard from '../components/GlassCard';
import styles from './Contact.module.css';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className={styles.main}>
            <PremiumBackground />
            <Navbar />
            
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={`${styles.title} animate-up shimmer-text`}>Get in Touch</h1>
                    <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                        Whether you&apos;re a user, a partner, or just curious about our tech, we&apos;d love to hear from you.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <div className={`${styles.infoSection} animate-up`} style={{ animationDelay: '200ms' }}>
                        <div className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <Mail size={24} />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Email Us</h4>
                                <p>datacoinsoftware@gmail.com</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <Phone size={24} />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Call Support</h4>
                                <p>+91 (9939429446)</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <MapPin size={24} />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Global HQ</h4>
                                <p>Innovation Hub, San Francisco, CA</p>
                            </div>
                        </div>

                        <GlassCard className={styles.promoCard}>
                            <h4 className={styles.promoTitle}>
                                <MessageSquare size={20} className={styles.promoIcon} /> 24/7 Live Support
                            </h4>
                            <p className={styles.promoDesc}>
                                Our automated safety assistants are always online to help you with immediate 
                                route queries or system feedback.
                            </p>
                        </GlassCard>
                    </div>

                    <GlassCard className={`${styles.formCard} animate-up`} style={{ animationDelay: '300ms' }}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="glass-input" 
                                    placeholder="Jane Doe"
                                    required 
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="glass-input" 
                                    placeholder="jane@example.com"
                                    required 
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea 
                                    id="message" 
                                    className={`glass-input ${styles.textArea}`} 
                                    placeholder="How can we help you today?"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                                <Send size={18} /> Send Message
                            </button>

                            {submitted && (
                                <div className={styles.successMsg}>
                                    <CheckCircle size={18} />
                                    <span>Your message has been sent successfully.</span>
                                </div>
                            )}
                        </form>
                    </GlassCard>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
