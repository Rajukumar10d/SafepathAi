import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', style }) {
    return (
        <div className={`${styles.glassCard} ${className}`} style={style}>
            {children}
        </div>
    );
}
