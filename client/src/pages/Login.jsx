import { useState, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import PremiumBackground from '../components/PremiumBackground';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function AuthContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const searchParams = new URLSearchParams(location.search);
    const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
            const response = await axios.post(endpoint, formData);
            
            if (response.data.token) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
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

                {error && (
                    <div className={styles.errorMessage} style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
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
                            value={formData.email}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
                            className="glass-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`btn btn-primary ${styles.submitBtn}`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isSignup ? 'Sign Up' : 'Log In'} <ArrowRight size={20} />
                            </>
                        )}
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
