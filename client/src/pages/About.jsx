import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PremiumBackground from '../components/PremiumBackground';
import GlassCard from '../components/GlassCard';
import { ShieldCheck, BrainCircuit, Globe, Users, Heart, Zap } from 'lucide-react';
import styles from './About.module.css';

export default function About() {
    return (
        <div className={styles.main}>
            <PremiumBackground />
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={`${styles.title} animate-up shimmer-text`}>A New Era of Personal Safety</h1>
                    <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                        SafePath AI is more than just a navigation app. We are building a global protective
                        shield for women, powered by collective intelligence and neural networks.
                    </p>
                </div>

                <div className={styles.impactSection}>
                    <div className={styles.statGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>99%</span>
                            <span className={styles.statLabel}>Route Accuracy</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>1.2M+</span>
                            <span className={styles.statLabel}>Safety Hotspots</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>24/7</span>
                            <span className={styles.statLabel}>Bot Monitoring</span>
                        </div>
                    </div>
                </div>

                <section className={styles.missionSection}>
                    <h2 className={`${styles.title} animate-up`} style={{ fontSize: '2.5rem' }}>Our Core Pillars</h2>
                    <div className={styles.visionGrid}>
                        <GlassCard className={styles.visionCard}>
                            <div className={styles.iconWrapper}>
                                <BrainCircuit size={32} />
                            </div>
                            <h3 className={styles.visionTitle}>Predictive Trust</h3>
                            <p className={styles.visionDesc}>
                                We move beyond reactive mapping. Our AI predicts risk by analyzing
                                environmental shifts, street lamp health, and dynamic city data.
                            </p>
                        </GlassCard>

                        <GlassCard className={styles.visionCard}>
                            <div className={styles.iconWrapper}>
                                <Globe size={32} />
                            </div>
                            <h3 className={styles.visionTitle}>Unified Network</h3>
                            <p className={styles.visionDesc}>
                                A seamless integration of community reports, local safe-havens,
                                and emergency responders in one single, responsive mesh.
                            </p>
                        </GlassCard>

                        <GlassCard className={styles.visionCard}>
                            <div className={styles.iconWrapper}>
                                <Heart size={32} />
                            </div>
                            <h3 className={styles.visionTitle}>Empowerment First</h3>
                            <p className={styles.visionDesc}>
                                Our mission is to eliminate fear from travel. We believe every
                                woman deserves the freedom to move with total confidence.
                            </p>
                        </GlassCard>
                    </div>
                </section>

                <div className={styles.storySection}>
                    <div className={styles.storyContent}>
                        <h2 className="shimmer-text">Why SafePath AI?</h2>
                        <p>
                            Traditional navigation systems are built for distance and time. They
                            often ignore the most critical variable for millions: **Safety.**
                        </p>
                        <p style={{ marginTop: '20px' }}>
                            SafePath AI was born out of a hackathon challenge to solve real-world urban
                            security gaps. We've combined cutting-edge geospatial technology with
                            societal intelligence to create a tool that doesn't just show you the
                            way, but watches your back.
                        </p>
                        <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                            <div className={styles.iconWrapper} style={{ width: 'auto', padding: '0 20px', height: '50px' }}>
                                <Users size={18} style={{ marginRight: '10px' }} /> 1k Community
                            </div>
                            <div className={styles.iconWrapper} style={{ width: 'auto', padding: '0 20px', height: '50px' }}>
                                <Zap size={18} style={{ marginRight: '10px' }} /> 50ms Response
                            </div>
                        </div>
                    </div>
                    <div className={styles.imageBox}>
                        <ShieldCheck size={120} color="var(--primary)" opacity={0.5} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
