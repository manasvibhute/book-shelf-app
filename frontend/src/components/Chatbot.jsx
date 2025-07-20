import { useState } from "react";
import '../stylesheets/chatbot.css';

export default function ChatbotModal({ onClose }) {
    const [userMessage, setUserMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleSend = async () => {
        if (!userMessage.trim()) return;

        const newHistory = [...chatHistory, { role: "user", text: userMessage }];
        setChatHistory(newHistory);
        setUserMessage("");
        setLoading(true);

        try {
            // Extract keywords for Google Books search
            const query = encodeURIComponent(userMessage);
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);

            const data = await res.json();
            if (!data.items || data.items.length === 0) {
                setChatHistory([
                    ...newHistory,
                    { role: "bot", text: ["😔 Sorry, I couldn't find anything."] },
                ]);
            } else {
                const top5 = data.items.slice(0, 5).map((item, index) => {
                    const title = item.volumeInfo.title || "Unknown Title";
                    const author = item.volumeInfo.authors?.[0] || "Unknown Author";
                    return `📘 ${title} — by ${author}`;
                });

                setChatHistory([
                    ...newHistory,
                    { role: "bot", text: top5 },
                ]);
            }
        } catch (error) {
            console.error("Google Books API error:", error);
            setChatHistory([
                ...newHistory,
                { role: "bot", text: ["Something went wrong. Please try again later."] },
            ]);
        }

        setLoading(false);
    };

    return (
        <div className="chat-modal">
            <div className="chat-header">
                📚 BookBot
                <button onClick={onClose} className="clear-btn">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="chat-body">
                {chatHistory.map((msg, idx) =>
                    msg.role === "user" ? (
                        <div key={idx} className="chat-message user-msg">{msg.text}</div>
                    ) : (
                        <ul key={idx} className="chat-message bot-msg">
                            {msg.text.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )
                )}
                {loading && <p className="text-gray-500">Searching...</p>}
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask me for book suggestions..."
                />
                <button className="send" onClick={handleSend}>Send</button>
            </div>
        </div >
    );

}
