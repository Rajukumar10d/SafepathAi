import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Database, BrainCircuit, Globe } from 'lucide-react';
import styles from './page.module.css';

export default function About() {
    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={`${styles.title} animate-fade-in`}>About SafePath AI</h1>
                    <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                        Empowering women through proactive technology and community intelligence.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={`${styles.section} animate-fade-in delay-200`}>
                        <div className={styles.textContent}>
                            <h2><BrainCircuit style={{ display: 'inline', marginRight: '12px' }} />Artificial Intelligence</h2>
                            <p>
                                Our core engine utilizes advanced predictive models that analyze historical
                                crime data, real-time lighting statuses, and pedestrian density to evaluate
                                the safety of any given route instantly before you even step outside.
                            </p>
                        </div>
                        <div className={styles.imagePlaceholder}>AI Visualization Graph</div>
                    </div>

                    <div className={`${styles.section} ${styles.reverse} animate-fade-in delay-300`}>
                        <div className={styles.textContent}>
                            <h2><Database style={{ display: 'inline', marginRight: '12px' }} />Real-time Crime Data</h2>
                            <p>
                                We aggregate verified reports from local authorities alongside crowdsourced
                                community alerts, providing an up-to-the-minute risk assessment that adjusts dynamically as situations evolve.
                            </p>
                        </div>
                        <div className={styles.imagePlaceholder}>Data Heatmap Simulation</div>
                    </div>

                    <div className={`${styles.section} animate-fade-in delay-300`}>
                        <div className={styles.textContent}>
                            <h2><Globe style={{ display: 'inline', marginRight: '12px' }} />Location Analysis</h2>
                            <p>
                                Knowing a path is safe is only half the battle. Our mapping infrastructure
                                ensures that you have constant cellular network coverage and access to
                                nearby safe havens like 24/7 stores and police stations.
                            </p>
                        </div>
                        <div className={styles.imagePlaceholder}>Live Map Segment</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
