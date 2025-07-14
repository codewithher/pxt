import * as React from "react";

export const LLMChat: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [messages, setMessages] = React.useState<string[]>([]);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, `You: ${input}`, `LLM: ${input}`];
        setMessages(newMessages);
        setInput("");
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleToggle}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px 15px",
                    background: "#007acc",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1000
                }}
            >
                {isOpen ? "Close Chat" : "LLM Chat"}
            </button>

            {/* Chat Popup */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "70px",
                        right: "20px",
                        width: "300px",
                        height: "400px",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1000,
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                    }}
                >
                    {/* Chat Header */}
                    <div
                        style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            fontWeight: "bold"
                        }}
                    >
                        Ask a Question
                    </div>

                    {/* Chat Messages */}
                    <div
                        style={{
                            flex: 1,
                            padding: "10px",
                            overflowY: "auto",
                            fontSize: "14px"
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            style={{ width: "100%", padding: "5px", fontSize: "14px" }}
                            placeholder="Ask your question..."
                        />
                    </div>
                </div>
            )}
        </>
    );
};
