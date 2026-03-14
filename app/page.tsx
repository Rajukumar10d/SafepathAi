import Link from 'next/link';
import { LocateFixed, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={`${styles.glowBlob} animate-float`}></div>
          <h1 className={`${styles.title} animate-up`}>
            Navigate Life,<br />With Confidence.
          </h1>
          <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '200ms' }}>
            Intelligent women safety navigation system.
            AI-powered risk prediction, real-time map analysis,
            and instant emergency alerts ensuring your path is always safe.
          </p>

          <div className={`${styles.heroButtons} animate-up`} style={{ animationDelay: '400ms' }}>
            <Link href="/dashboard/predict" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
              <ShieldAlert size={22} /> Try Safety Check
            </Link>
          </div>
        </section>

        <section className={styles.features}>
          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '500ms' }}>
            <div className={styles.featureIcon}>
              <Sparkles size={32} />
            </div>
            <h3 className={styles.featureTitle}>AI Risk Prediction</h3>
            <p className={styles.featureDesc}>
              Advanced algorithms analyze crime data and location intelligence to predict the safety score of any route you plan to take.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '600ms' }}>
            <div className={styles.featureIcon}>
              <LocateFixed size={32} />
            </div>
            <h3 className={styles.featureTitle}>Live Route Map</h3>
            <p className={styles.featureDesc}>
              Visualise your journey. The map highlights safe pathways, well-lit areas, and helps avoid potential high-risk zones.
            </p>
          </GlassCard>

          <GlassCard className={`${styles.featureCard} animate-up`} style={{ animationDelay: '700ms' }}>
            <div className={styles.featureIcon}>
              <AlertTriangle size={32} />
            </div>
            <h3 className={styles.featureTitle}>1-Click Emergency</h3>
            <p className={styles.featureDesc}>
              Instantly broadcast your live location to trusted contacts and the community network with a single, massive alert button.
            </p>
          </GlassCard>
        </section>
      </main>

      <Footer />
    </div>
  );
}
