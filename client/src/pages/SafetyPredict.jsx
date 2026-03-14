import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, Navigation, Map, Moon } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import styles from './SafetyPredict.module.css';

export default function SafetyPredict() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        time: 'day'
    });

    const srcInputRef = useRef(null);
    const dstInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        // Simulate AI Prediction Logic
        setTimeout(() => {
            const hash = formData.source.length + formData.destination.length + (formData.time === 'night' ? 20 : 0);

            let riskScore = 0;
            if (formData.time === 'night') {
                riskScore = 50 + (hash % 40); // 50-90
            } else {
                riskScore = 10 + (hash % 40); // 10-50
            }

            const safetyScore = riskScore > 60 ? (100 - riskScore) : (100 - riskScore + 40); 
            const finalScore = Math.min(Math.max(safetyScore, 10), 98); 

            let status = 'safe';
            let message = 'Safe Route Detected';

            const level = finalScore > 70 ? 'Low' : finalScore >= 40 ? 'Medium' : 'High';

            const isRajasthan = formData.source.toLowerCase().includes('rajasthan') || formData.destination.toLowerCase().includes('rajasthan') ||
                formData.source.toLowerCase().includes('jaipur') || formData.destination.toLowerCase().includes('jodhpur') ||
                formData.source.toLowerCase().includes('udaipur') || formData.destination.toLowerCase().includes('kota');

            const explanations = [
                finalScore > 70 ? 'High visibility and active street lighting reported.' : 'Limited street lighting in some sections based on community data.',
                formData.time === 'night' ? 'Night-time risk factor active: Fewer open business establishments after 10 PM.' : 'Daytime traffic and active commerce providing natural surveillance.',
                isRajasthan ? 'Rajasthan Safety Network Verified: Regular police patrols active in this sector.' : (Math.random() > 0.5 ? '2 mobile patrol units active along this route.' : 'Moderate police presence reported currently.'),
                isRajasthan ? 'SafePath verified: Low incident reports in this Rajasthan district recently.' : 'Area has 0 reported major incidents in the last 15 days.'
            ];

            setResult({
                score: finalScore,
                status,
                route: `Route ${Math.random() > 0.5 ? 'A' : 'B'} (via Main St)`,
                message,
                explanation: explanations,
                level
            });
            setLoading(false);
        }, 2000); 
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${styles.title} animate-fade-in`}>AI Safety Check</h1>
                <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                    Predict the safest route in <strong>Rajasthan</strong> using our integrated safety intelligence network.
                </p>
            </div>

            <GlassCard className={`${styles.formCard} animate-fade-in delay-200`}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="source">Source Location</label>
                        <input
                            type="text"
                            id="source"
                            ref={srcInputRef}
                            className="glass-input"
                            placeholder="e.g., WTP, Jaipur"
                            required
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="destination">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            ref={dstInputRef}
                            className="glass-input"
                            placeholder="e.g., SKIT College, Jaipur"
                            required
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="time">Time of Travel</label>
                        <select
                            id="time"
                            className={styles.glassSelect}
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        >
                            <option value="day">Day time (6 AM - 6 PM)</option>
                            <option value="night">Night time (6 PM - 6 AM)</option>
                        </select>
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Loader2 className={styles.spinner} /> Processing AI Data...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck /> Predict Safety
                            </span>
                        )}
                    </button>
                </form>
            </GlassCard>

            {result && (
                <GlassCard className={`${styles.resultCard} animate-scale-in`}>
                    {formData.time === 'night' && (
                        <div className={styles.nightWarning}>
                            <Moon size={16} /> Night Mode Active: Use well-lit main roads only.
                        </div>
                    )}

                    <div className={styles.resultHeader}>
                        <div className={styles.scoreCircle}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path
                                    className={`${styles.circle} ${styles[result.status]}`}
                                    strokeDasharray={`${result.score}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" className={styles.percentage}>{result.score}%</text>
                            </svg>
                        </div>
                        <div className={styles.statusInfo}>
                            <div className={styles.statusRow}>
                                <span className={styles.statusLabel}>Safety Score</span>
                                <span className={`${styles.levelBadge} ${styles[`level${result.level}`]}`}>
                                    {result.level} Risk
                                </span>
                            </div>
                            <h2 className={`${styles.statusText} ${styles[result.status]}`}>{result.message}</h2>
                        </div>
                    </div>

                    <div className={styles.aiExplanation}>
                        <h4 className={styles.explanationTitle}>
                            <ShieldCheck size={16} color="var(--primary)" /> AI Safety Analysis
                        </h4>
                        <ul className={styles.explanationList}>
                            {result.explanation.map((item, i) => (
                                <li key={i} className={styles.explanationItem}>
                                    <div className={styles.dot} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.recommendation}>
                        <Navigation size={18} style={{ color: 'var(--primary)' }} />
                        <div className={styles.recText}>
                            <span className={styles.recLabel}>Recommended Route</span>
                            <span className={styles.recValue}>{result.route}</span>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onClick={() => navigate(`/dashboard/map?source=${encodeURIComponent(formData.source)}&destination=${encodeURIComponent(formData.destination)}`)}
                        >
                            <Map size={18} /> View on Map
                        </button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
