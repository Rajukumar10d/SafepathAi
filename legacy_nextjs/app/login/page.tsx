'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import PremiumBackground from '@/components/PremiumBackground';
import styles from './page.module.css';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Simulate authentication
        setTimeout(() => {
            router.push('/dashboard');
        }, 600);
    };

    return (
        <div className={styles.container}>
            <PremiumBackground />

            <GlassCard className={`${styles.authCard} animate-up`}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <ShieldAlert size={48} />
                    </div>
                    <h1 className={styles.title}>
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isSignup
                            ? 'Join the intelligent safety network'
                            : 'Enter your credentials to access your secure dashboard'}
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="glass-input"
                                placeholder="Jane Doe"
                                required
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="glass-input"
                            placeholder="jane@example.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="glass-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                        {isSignup ? 'Sign Up' : 'Log In'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className={styles.toggle}>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
