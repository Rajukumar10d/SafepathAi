import { useState, useEffect } from 'react';
import {
    AlertTriangle, Phone, Radio, CheckCircle2, Shield, Share2,
    Siren, MessageCircle, MapPin, Users, Heart, Clock, X, Plus
} from 'lucide-react';
import styles from './EmergencyDashboard.module.css';

const HELPLINES = [
    { name: 'National Emergency', number: '112', icon: '🚨', color: '#ef4444', desc: 'All-in-one emergency service' },
    { name: 'Police', number: '100', icon: '🚔', color: '#3b82f6', desc: 'Immediate police assistance' },
    { name: 'Women Helpline', number: '1091', icon: '👩', color: '#8b5cf6', desc: '24/7 women safety helpline' },
    { name: 'Ambulance', number: '108', icon: '🚑', color: '#ef4444', desc: 'Medical emergency' },
    { name: 'Domestic Violence', number: '181', icon: '🏠', color: '#f59e0b', desc: 'Domestic violence helpline' },
    { name: 'Child Helpline', number: '1098', icon: '🧒', color: '#10b981', desc: 'Child safety and rescue' },
];

const SAFETY_STEPS = [
    { icon: '🏃', title: 'Move to Safety', desc: 'Go to a well-lit, populated area immediately. Avoid isolated spots.' },
    { icon: '📞', title: 'Call for Help', desc: 'Call police (100) or women helpline (1091). Stay on the line.' },
    { icon: '📍', title: 'Share Location', desc: 'Send your live location to trusted family/friends right away.' },
    { icon: '🔊', title: 'Make Noise', desc: "Shout, use your alarm, blow a whistle — attract people's attention." },
    { icon: '🤝', title: 'Trust Bystanders', desc: 'Ask someone nearby for help. Enter a shop, restaurant or bank.' },
];

const DEFAULT_CONTACTS = [
    { name: 'Mom', relation: 'Primary', initial: 'M', color: '#8b5cf6' },
    { name: 'Sister', relation: 'Secondary', initial: 'S', color: '#3b82f6' },
];

export default function EmergencyDashboard() {
    const [alertSent, setAlertSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [notified, setNotified] = useState([]);
    const [activeTab, setActiveTab] = useState('sos');
    const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
    const [newContact, setNewContact] = useState({ name: '', relation: '' });

    useEffect(() => {
        const saved = localStorage.getItem('safepath_contacts');
        if (saved) setContacts(JSON.parse(saved));
    }, []);

    const saveContacts = (updated) => {
        setContacts(updated);
        localStorage.setItem('safepath_contacts', JSON.stringify(updated));
    };

    const handleSOS = () => {
        if (alertSent) return;
        setAlertSent(true);
        setCountdown(10);

        contacts.forEach((c, i) => {
            setTimeout(() => setNotified(prev => [...prev, c.name]), (i + 1) * 800);
        });

        setTimeout(() => setNotified(prev => [...prev, 'Local Authorities']), (contacts.length + 1) * 800);

        setTimeout(() => {
            setAlertSent(false);
            setCountdown(0);
            setNotified([]);
        }, 12000);
    };

    const addContact = () => {
        if (!newContact.name || !newContact.relation) return;
        const updated = [...contacts, {
            name: newContact.name,
            relation: newContact.relation,
            initial: newContact.name[0].toUpperCase(),
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        }];
        saveContacts(updated);
        setNewContact({ name: '', relation: '' });
    };

    const deleteContact = (name) => {
        const updated = contacts.filter(c => c.name !== name);
        saveContacts(updated);
    };

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: 'SOS — SafePath AI', text: "I need help! Here's my current location:", url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Location link copied to clipboard!');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${styles.title} animate-up`}>
                    <Siren size={32} className={styles.headerIcon} /> <span className="shimmer-text">Emergency Center</span>
                </h1>
                <p className={`${styles.subtitle} animate-up`} style={{ animationDelay: '100ms' }}>
                    Instant SOS protocol and professional safety resources.
                </p>
            </div>

            <div className={`${styles.tabBar} animate-fade-in delay-100`}>
                <button className={`${styles.tab} ${activeTab === 'sos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('sos')}>
                    <AlertTriangle size={16} /> SOS Alert
                </button>
                <button className={`${styles.tab} ${activeTab === 'helplines' ? styles.activeTab : ''}`} onClick={() => setActiveTab('helplines')}>
                    <Phone size={16} /> Helplines
                </button>
                <button className={`${styles.tab} ${activeTab === 'tips' ? styles.activeTab : ''}`} onClick={() => setActiveTab('tips')}>
                    <Shield size={16} /> Safety Tips
                </button>
            </div>

            {activeTab === 'sos' && (
                <div className={`${styles.tabContent} animate-fade-in`}>
                    <div className={styles.sosGrid}>
                        <div className={styles.sosCard}>
                            <p className={styles.sosHint}>
                                {alertSent ? `Alert sent! Contacts notified.` : 'Hold to send an instant SOS alert to your trusted contacts'}
                            </p>
                            <div className={styles.sosWrapper}>
                                {alertSent && <div className={styles.pulseRing} />}
                                {alertSent && <div className={styles.pulseRing2} />}
                                <button
                                    className={`${styles.sosButton} ${alertSent ? styles.sosActive : ''}`}
                                    onClick={handleSOS}
                                    disabled={alertSent}
                                >
                                    {alertSent ? (
                                        <>
                                            <Radio size={44} className={styles.sosPulseIcon} />
                                            <span>SENDING</span>
                                            {countdown > 0 && <span className={styles.sosTimer}>{countdown}s</span>}
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle size={44} />
                                            <span>SOS</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className={styles.quickActions}>
                                <a href="tel:100" className={styles.quickBtn} style={{ background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)' }}>
                                    <Phone size={18} color="#3b82f6" />
                                    <span>Police</span>
                                    <strong>100</strong>
                                </a>
                                <a href="tel:1091" className={styles.quickBtn} style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.4)' }}>
                                    <Heart size={18} color="#8b5cf6" />
                                    <span>Women</span>
                                    <strong>1091</strong>
                                </a>
                                <button className={styles.quickBtn} onClick={handleShare} style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.4)', border: '1px solid', cursor: 'pointer' }}>
                                    <Share2 size={18} color="#10b981" />
                                    <span>Share</span>
                                    <strong>Location</strong>
                                </button>
                                <a href="tel:108" className={styles.quickBtn} style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)' }}>
                                    <MapPin size={18} color="#ef4444" />
                                    <span>Ambulance</span>
                                    <strong>108</strong>
                                </a>
                            </div>
                        </div>

                        <div className={styles.contactsCard}>
                            <div className={styles.sectionHeading}>
                                <Users size={18} /> Trusted Contacts
                            </div>
                            <div className={styles.contactsList}>
                                {contacts.map((c) => {
                                    const isNotified = notified.includes(c.name);
                                    return (
                                        <div key={c.name} className={styles.contactItem}>
                                            <div className={styles.contactAvatar} style={{ background: c.color }}>
                                                {c.initial}
                                            </div>
                                            <div className={styles.contactInfo}>
                                                <span className={styles.contactName}>{c.name}</span>
                                                <span className={styles.contactRelation}>{c.relation}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className={`${styles.contactStatus} ${isNotified ? styles.notified : alertSent ? styles.sending : ''}`}>
                                                    {isNotified ? (
                                                        <><CheckCircle2 size={14} /> Notified</>
                                                    ) : alertSent ? (
                                                        <><Clock size={14} /> Sending...</>
                                                    ) : (
                                                        <><MessageCircle size={14} /> Ready</>
                                                    )}
                                                </div>
                                                {!alertSent && (
                                                    <button onClick={() => deleteContact(c.name)} className={styles.contactDeleteBtn}>
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!alertSent && (
                                <div className={styles.addContactForm}>
                                    <h4 style={{ fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                                        <Plus size={14} /> Add Trusted Person
                                    </h4>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className={styles.contactInput}
                                            style={{ flex: 1, minWidth: '100px' }}
                                            value={newContact.name}
                                            onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Relation"
                                            className={styles.contactInput}
                                            style={{ flex: 1, minWidth: '100px' }}
                                            value={newContact.relation}
                                            onChange={e => setNewContact({ ...newContact, relation: e.target.value })}
                                        />
                                        <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={addContact}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={styles.contactsList} style={{ marginTop: '1.5rem' }}>
                                <div className={styles.contactItem}>
                                    <div className={styles.contactAvatar} style={{ background: '#374151', fontSize: '1.2rem' }}>🏛️</div>
                                    <div className={styles.contactInfo}>
                                        <span className={styles.contactName}>Local Authorities</span>
                                        <span className={styles.contactRelation}>112 Dispatch</span>
                                    </div>
                                    <div className={`${styles.contactStatus} ${notified.includes('Local Authorities') ? styles.notified : alertSent ? styles.sending : ''}`}>
                                        {notified.includes('Local Authorities') ? (
                                            <><CheckCircle2 size={14} /> Alerted</>
                                        ) : alertSent ? (
                                            <><Clock size={14} /> Sending...</>
                                        ) : (
                                            <><Radio size={14} /> Standby</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'helplines' && (
                <div className={`${styles.tabContent} animate-fade-in`}>
                    <div className={styles.helplinesGrid}>
                        {HELPLINES.map((h) => (
                            <a key={h.number} href={`tel:${h.number}`} className={styles.helplineCard} style={{ borderColor: `${h.color}40` }}>
                                <div className={styles.helplineIcon} style={{ background: `${h.color}20`, color: h.color }}>
                                    <span style={{ fontSize: '1.8rem' }}>{h.icon}</span>
                                </div>
                                <div className={styles.helplineInfo}>
                                    <span className={styles.helplineName}>{h.name}</span>
                                    <span className={styles.helplineDesc}>{h.desc}</span>
                                </div>
                                <div className={styles.helplineNumber} style={{ color: h.color }}>
                                    <Phone size={14} />
                                    {h.number}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'tips' && (
                <div className={`${styles.tabContent} animate-fade-in`}>
                    <div className={styles.tipsGrid}>
                        {SAFETY_STEPS.map((step, i) => (
                            <div key={i} className={styles.tipCard}>
                                <div className={styles.tipNumber}>{i + 1}</div>
                                <div className={styles.tipEmoji}>{step.icon}</div>
                                <h3 className={styles.tipTitle}>{step.title}</h3>
                                <p className={styles.tipDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.disclaimer}>
                        <Shield size={16} />
                        <span>SafePath AI — Committed to every woman's right to travel safely.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
