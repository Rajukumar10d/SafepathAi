import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm SafeBot. How can I help you stay safe today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Logic
        setTimeout(() => {
            let response = "I'm analyzing your request. Please stay in well-lit areas.";
            const lowInput = input.toLowerCase();

            if (lowInput.includes('help') || lowInput.includes('emergency')) {
                response = "Emergency protocol active in Rajasthan. Use the SOS button or contact Rajasthan Women Helpline at <a href='tel:1091' style='color: #8b5cf6; text-decoration: underline;'>1091</a>.";
            } else if (lowInput.includes('dark') || lowInput.includes('light')) {
                response = "I've flagged dark spots in Jaipur and Udaipur. Please report new ones in the 'Reports' section.";
            } else if (lowInput.includes('safe') || lowInput.includes('route')) {
                response = "Use the 'AI Safety Check' for optimized routing through the Rajasthan Safety Network.";
            } else if (lowInput.includes('police')) {
                response = "Nearby Rajasthan Police station data is loaded on the 'Live Map'. Use the 'Police' toggle.";
            }

            const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={styles.chatbotContainer}>
            {!isOpen ? (
                <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
                    <MessageSquare size={28} />
                    <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', height: 12, width: 12, borderRadius: '50%', border: '2px solid #0f172a' }} />
                </button>
            ) : (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerTitle}>
                            <Bot size={20} /> SafeBot AI
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.chatMessages} ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                                {msg.sender === 'bot' ? (
                                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className={styles.typing}>SafeBot is thinking...</div>
                        )}
                    </div>

                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            className={styles.inputField}
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className={styles.sendBtn} onClick={handleSend}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
