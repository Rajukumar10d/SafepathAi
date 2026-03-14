'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, ShieldCheck, MapPin, AlertTriangle,
    Calendar, Users, Zap, Info
} from 'lucide-react';
import styles from './page.module.css';

const SAFETY_TREND_DATA = [
    { day: 'Mon', score: 85, incidental: 2 },
    { day: 'Tue', score: 82, incidental: 3 },
    { day: 'Wed', score: 88, incidental: 1 },
    { day: 'Thu', score: 75, incidental: 5 },
    { day: 'Fri', score: 70, incidental: 8 },
    { day: 'Sat', score: 65, incidental: 12 },
    { day: 'Sun', score: 80, incidental: 4 },
];

const RISK_BY_TIME = [
    { time: '6-9 AM', risk: 10 },
    { time: '9-12 PM', risk: 25 },
    { time: '12-3 PM', risk: 20 },
    { time: '3-6 PM', risk: 35 },
    { time: '6-9 PM', risk: 65 },
    { time: '9-12 AM', risk: 85 },
    { time: '12-6 AM', risk: 95 },
];

const TOP_RISK_AREAS = [
    { name: 'Industrial Zone B', risk: 'High', incidents: 12 },
    { name: 'East Park Alleyway', risk: 'High', incidents: 9 },
    { name: 'Metro Extension', risk: 'Medium', incidents: 5 },
    { name: 'North Road Underpass', risk: 'Medium', incidents: 6 },
    { name: 'South Mall Parking', risk: 'Medium', incidents: 4 },
];

export default function AnalyticsDashboard() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${styles.title} animate-fade-in`}>Safety Analytics</h1>
                <p className={`${styles.subtitle} animate-fade-in delay-100`}>
                    Comprehensive data analysis of safety trends and risk factors.
                </p>
            </div>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                {[
                    { label: 'Avg Safety Score', value: '78%', icon: ShieldCheck, color: '#10b981', trend: '+5%', up: true },
                    { label: 'Routes Analyzed', value: '1,284', icon: TrendingUp, color: '#3b82f6', trend: '+12%', up: true },
                    { label: 'Risk Alerts', value: '24', icon: AlertTriangle, color: '#ef4444', trend: '-8%', up: true },
                    { label: 'Community Reports', value: '156', icon: Users, color: '#8b5cf6', trend: '+24%', up: true },
                ].map((stat, i) => (
                    <div key={i} className={`${styles.statCard} animate-fade-in`} style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                        <div className={styles.statIcon} style={{ background: `${stat.color}20`, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <span className={styles.statValue}>{stat.value}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <span className={`${styles.trend} ${stat.up ? styles.up : styles.down}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                {/* Main Trend Chart */}
                <div className={`${styles.chartContainer} animate-fade-in delay-200`}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}><TrendingUp size={20} color="#3b82f6" /> Weekly Safety Index</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Info size={14} /> Last 7 Days
                            </span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={SAFETY_TREND_DATA}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution by Time */}
                <div className={`${styles.chartContainer} animate-fade-in delay-300`}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}><Zap size={20} color="#f59e0b" /> Risk by Time</h2>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={RISK_BY_TIME} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="time" type="category" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} width={60} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                />
                                <Bar dataKey="risk" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className={styles.chartsGrid}>
                {/* Risk Areas List */}
                <div className={`${styles.chartContainer} animate-fade-in delay-400`} style={{ minHeight: 'auto' }}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}><AlertTriangle size={20} color="#ef4444" /> High Risk Areas</h2>
                    </div>
                    <div className={styles.riskList}>
                        {TOP_RISK_AREAS.map((area, i) => (
                            <div key={i} className={styles.riskItem}>
                                <div className={styles.areaInfo}>
                                    <span className={styles.areaName}>{area.name}</span>
                                    <span className={styles.incidentCount}>{area.incidents} incidents reported</span>
                                </div>
                                <span className={`${styles.riskBadge} ${area.risk === 'High' ? styles.high : styles.medium}`}>
                                    {area.risk} Risk
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Component or Empty Space */}
                <div className={`${styles.chartContainer} animate-fade-in delay-500`} style={{ minHeight: 'auto', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))' }}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}><Calendar size={20} color="#10b981" /> Monthly Summary</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Your area has seen a <strong>15% decrease</strong> in reported incidents this month.
                        </p>
                        <div style={{ fontSize: '2.5rem' }}>🌱</div>
                        <p style={{ color: '#10b981', fontWeight: 600 }}>Community Safety Improving</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
