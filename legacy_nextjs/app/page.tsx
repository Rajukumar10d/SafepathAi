import Link from 'next/link';
import { LocateFixed, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import PremiumBackground from '@/components/PremiumBackground';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <PremiumBackground />
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={`${styles.glowBlob} animate-float`}></div>
          <h1 className={`${styles.title} animate-up shimmer-text`}>
            Navigate Life,<br />With Confidence.
          </h1>
          <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '200ms' }}>
            Empowering women with intelligent, AI-driven safety navigation. 
            Real-time risk assessment, community-sourced intelligence, 
            and instant SOS networking at your fingertips.
          </p>

          <div className={`${styles.heroButtons} animate-up`} style={{ animationDelay: '400ms' }}>
            <Link href="/dashboard/predict" className="btn btn-primary" style={{ padding: '18px 45px', fontSize: '1.1rem', borderRadius: '50px' }}>
              <ShieldAlert size={22} /> Get Started Now
            </Link>
          </div>

          <div className={`${styles.trustSector} animate-up`} style={{ animationDelay: '500ms' }}>
            <p>TRUSTED BY INNOVATORS IN SAFETY</p>
            <div className={styles.trustLogos}>
              <span className={styles.logoItem}>SafetyGlobal</span>
              <span className={styles.logoItem}>WomenGuard</span>
              <span className={styles.logoItem}>SecureCity</span>
              <span className={styles.logoItem}>CivicPulse</span>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '600ms' }}>
            <div className={styles.featureIcon}>
              <Sparkles size={32} />
            </div>
            <h3 className={styles.featureTitle}>Neural Safety Guard</h3>
            <p className={styles.featureDesc}>
              Our proprietary neural network processes over 1M+ data points daily to pinpoint risk before it happens.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '700ms' }}>
            <div className={styles.featureIcon}>
              <LocateFixed size={32} />
            </div>
            <h3 className={styles.featureTitle}>Quantum Path Map</h3>
            <p className={styles.featureDesc}>
              Dynamic routing that updates in milliseconds based on live street illumination and crowd density scores.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '800ms' }}>
            <div className={styles.featureIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.featureTitle}>Instant SOS Mesh</h3>
            <p className={styles.featureDesc}>
              A decentralized alert system that connects you to nearby verified responders and law enforcement instantly.
            </p>
          </GlassCard>
        </section>
      </main>

      <Footer />
    </div>
  );
}
