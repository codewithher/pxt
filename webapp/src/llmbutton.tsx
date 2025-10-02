import * as React from "react";

// declares LLMChat react component
export const LLMChat: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false); // controls whether the chat popup is open or closed
    const [input, setInput] = React.useState(""); // stores the user's input in text box
    const [messages, setMessages] = React.useState<string[]>([]); // stores the chat history

    const handleToggle = () => setIsOpen(!isOpen); 

    // handles sending the user's message to the backend
    const handleSend = async () => {
        if (!input.trim()) return; // if the input is empty, do nothing
    
        // add the user's message to chat and clears input field
        const userMessage = input;
        setMessages((prev) => [...prev, `You: ${userMessage}`]);
        setInput("");
    
        // sends the user's message to the backend and waits for the response
        try {
            const response = await fetch("http://localhost:3001/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });
    
            const data = await response.json(); // parses the JSON response from the backend
    
            // if there's a reply, show it, otherwise, show an error message
            if (data.reply) {
                setMessages((prev) => [...prev, `LLM: ${data.reply}`]);
            } else {
                setMessages((prev) => [...prev, "LLM: [Error getting reply]"]);
            }
        } 
        
        // error handling
        catch (err) {
            console.error("Error:", err);
            setMessages((prev) => [...prev, "LLM: [Network error]"]);
        }
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
