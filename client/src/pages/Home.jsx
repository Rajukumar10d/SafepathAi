import React from 'react';
import { Link } from 'react-router-dom';
import { LocateFixed, ShieldAlert, Sparkles, AlertTriangle, Users, HeartHandshake } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import PremiumBackground from '../components/PremiumBackground';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <PremiumBackground />
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={`${styles.glowBlob} animate-float`}></div>
          <h1 className={`${styles.title} animate-up shimmer-text`}>
            You&apos;re Never<br />Walking Alone.
          </h1>
          <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '200ms' }}>
            A community-powered safety network for women and allies. 
            Real-time risk awareness, caring neighbours, and instant support 
            wherever your journey takes you.
          </p>

          <div className={`${styles.heroButtons} animate-up`} style={{ animationDelay: '400ms' }}>
            <Link to="/dashboard/predict" className="btn btn-primary" style={{ padding: '18px 45px', fontSize: '1.1rem', borderRadius: '999px' }}>
              <ShieldAlert size={22} /> Start a Safe Journey
            </Link>
          </div>

          <div className={`${styles.trustSector} animate-up`} style={{ animationDelay: '500ms' }}>
            <p>TRUSTED BY COMMUNITIES &amp; SAFE-SPACES</p>
            <div className={styles.trustLogos}>
              <span className={styles.logoItem}>Local Women Circles</span>
              <span className={styles.logoItem}>Neighborhood Watch</span>
              <span className={styles.logoItem}>City SafeSpaces</span>
              <span className={styles.logoItem}>Community NGOs</span>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '600ms' }}>
            <div className={styles.featureIcon}>
              <HeartHandshake size={32} />
            </div>
            <h3 className={styles.featureTitle}>Community First Safety</h3>
            <p className={styles.featureDesc}>
              Verified reports from women, allies, and local partners turn every street into a shared safety watchlist.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '700ms' }}>
            <div className={styles.featureIcon}>
              <LocateFixed size={32} />
            </div>
            <h3 className={styles.featureTitle}>Safe Paths, Together</h3>
            <p className={styles.featureDesc}>
              Navigate with routes shaped by lighting, activity, and real stories from people who walk there every day.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '800ms' }}>
            <div className={styles.featureIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.featureTitle}>Instant SOS Circle</h3>
            <p className={styles.featureDesc}>
              When something feels wrong, reach your trusted contacts, community volunteers, and emergency services in seconds.
            </p>
          </GlassCard>
        </section>
      </main>

      <Footer />
    </div>
  );
}
