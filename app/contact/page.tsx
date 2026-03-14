'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={`${styles.title} animate-fade-in`}>Contact Us</h1>
                    <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                        Have a question, feedback, or want to partner with us? Reach out.
                    </p>
                </div>

                <GlassCard className={`${styles.formCard} animate-fade-in delay-200`}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" className="glass-input" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" className="glass-input" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" className={`glass-input ${styles.textArea}`} required></textarea>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                            <Send size={18} /> Send Message
                        </button>

                        {submitted && (
                            <div className={styles.successMsg}>
                                <CheckCircle size={18} style={{ display: 'inline', marginRight: '6px' }} />
                                Message sent successfully! We will get back to you soon.
                            </div>
                        )}
                    </form>
                </GlassCard>
            </div>
            <Footer />
        </div>
    );
}
