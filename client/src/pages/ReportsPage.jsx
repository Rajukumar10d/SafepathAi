import { useState, useEffect } from 'react';
import {
    ClipboardList, MapPin, AlertTriangle, Moon,
    MessageSquare, Shield, Clock, CheckCircle2,
    Plus, Search, Filter, Camera
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import styles from './ReportsPage.module.css';

const CATEGORIES = [
    { id: 'harassment', label: 'Harassment', icon: AlertTriangle, color: '#ef4444' },
    { id: 'dark_area', label: 'Dark Area', icon: Moon, color: '#f59e0b' },
    { id: 'suspicious', label: 'Suspicious Activity', icon: Shield, color: '#3b82f6' },
    { id: 'other', label: 'Other Issue', icon: MessageSquare, color: '#8b5cf6' },
];

const INITIAL_REPORTS = [
    {
        id: 1,
        category: 'Dark Area',
        location: 'Jagatpura Rly Station Backdoor, Jaipur',
        desc: 'Street lights are non-functional for the last 3 days. Area is completely dark after 7 PM.',
        time: '2 hours ago',
        status: 'Reported',
        severity: 'Warning'
    },
    {
        id: 2,
        category: 'Suspicious Activity',
        location: 'Clock Tower Market, Jodhpur',
        desc: 'Group of people loitering and making passing comments near the parking area.',
        time: '5 hours ago',
        status: 'Under Review',
        severity: 'Danger'
    },
    {
        id: 3,
        category: 'Harassment',
        location: 'Fateh Sagar Lake Promenade, Udaipur',
        desc: 'Followed by an unidentified individual for 100 meters. Safely reached a crowded shop.',
        time: '1 day ago',
        status: 'Resolved',
        severity: 'Danger'
    },
];

export default function ReportsPage() {
    const [activeCategory, setActiveCategory] = useState('dark_area');
    const [reports, setReports] = useState(INITIAL_REPORTS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        location: '',
        description: ''
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/reports');
                if (!res.ok) throw new Error('Failed to load reports');
                const data = await res.json();
                const normalized = data.map((item, idx) => ({
                    id: item.id || item._id || `remote-${idx}`,
                    category: item.category || 'Other',
                    location: item.location || 'Unknown Location',
                    desc: item.desc || item.description || '',
                    time: item.time || 'Recently',
                    status: item.status || 'Reported',
                    severity: item.severity || 'Info',
                }));
                setReports(normalized.length ? normalized : INITIAL_REPORTS);
                setError('');
            } catch (err) {
                setError('Live reports unavailable, showing sample community reports.');
                setReports(INITIAL_REPORTS);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const baseReport = {
            category: CATEGORIES.find(c => c.id === activeCategory)?.label || 'Other',
            location: formData.location || 'Unknown Location',
            description: formData.description,
            severity: activeCategory === 'harassment' ? 'Danger' : activeCategory === 'dark_area' ? 'Warning' : 'Info'
        };

        try {
            const res = await fetch('http://localhost:5000/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(baseReport)
            });
            const saved = await res.json();
            const newReport = {
                id: saved.id || saved._id || reports.length + 1,
                category: saved.category || baseReport.category,
                location: saved.location || baseReport.location,
                desc: saved.desc || saved.description || baseReport.description,
                time: saved.time || 'Just now',
                status: saved.status || 'Reported',
                severity: saved.severity || baseReport.severity
            };
            setReports([newReport, ...reports]);
            setSubmitted(true);
            setFormData({ location: '', description: '' });
            setError('');
            setTimeout(() => setSubmitted(false), 3000);
        } catch {
            const fallbackReport = {
                id: reports.length + 1,
                category: baseReport.category,
                location: baseReport.location,
                desc: baseReport.description,
                time: 'Just now',
                status: 'Reported (Offline)',
                severity: baseReport.severity
            };
            setReports([fallbackReport, ...reports]);
            setSubmitted(true);
            setFormData({ location: '', description: '' });
            setTimeout(() => setSubmitted(false), 3000);
            setError('Report saved locally. Backend is not reachable right now.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${styles.title} animate-up`}><span className="shimmer-text">Community Reports</span></h1>
                <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                    Share your experience to help other women stay safe. Your reports fuel our AI logic.
                </p>
            </div>

            {error && (
                <div className={styles.noticeBanner}>
                    {error}
                </div>
            )}

            <div className={styles.grid}>
                {/* Submit Report Form */}
                <GlassCard className={`${styles.card} animate-fade-in delay-200`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>
                        <Plus size={20} color="var(--primary)" /> File a New Report
                    </div>

                    <form className={styles.reportForm} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category</label>
                            <div className={styles.categoryGrid}>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.activeCategory : ''}`}
                                        onClick={() => setActiveCategory(cat.id)}
                                    >
                                        <cat.icon size={16} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text"
                                    className={styles.input}
                                    style={{ paddingLeft: '40px', width: '100%' }}
                                    placeholder="e.g. Sector 5 Market, Near Metro"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="What happened? Please provide details to help others..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Camera size={18} /> Add Photos
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>Processing...</>
                                ) : submitted ? (
                                    <><CheckCircle2 size={18} /> Reported!</>
                                ) : (
                                    <><ClipboardList size={18} /> Submit Report</>
                                )}
                            </button>
                        </div>
                    </form>
                </GlassCard>

                {/* Recent Reports List */}
                <div className={styles.recentReports}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                            <Search size={18} color="#94a3b8" /> Recent Incidents
                        </h3>
                        <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Filter size={14} /> Filter
                        </button>
                    </div>

                    {loading ? (
                        <div className={styles.emptyState}>
                            Loading latest community reports...
                        </div>
                    ) : reports.length === 0 ? (
                        <div className={styles.emptyState}>
                            No reports yet. Be the first to share and help others stay safe.
                        </div>
                    ) : (
                        reports.map((report, i) => (
                            <div key={report.id} className={`${styles.reportCard} animate-fade-in`} style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                                <div className={styles.reportHeader}>
                                    <div className={styles.reportLocation}>
                                        <MapPin size={16} color="var(--primary)" />
                                        {report.location}
                                    </div>
                                    <span className={`${styles.categoryTag} ${report.severity === 'Danger' ? styles.tagDanger : report.severity === 'Warning' ? styles.tagWarning : styles.tagInfo}`}>
                                        {report.category}
                                    </span>
                                </div>
                                <p className={styles.reportDesc}>{report.desc}</p>
                                <div className={styles.reportFooter}>
                                    <div className={styles.reportTime}>
                                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        {report.time}
                                    </div>
                                    <div className={styles.badge}>
                                        {report.status === 'Resolved' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                                        {report.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
