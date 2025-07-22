require("dotenv").config();
const express = require("express"); // to build HTTP servers in Node.js
const cors = require("cors"); //middleware, allows the frontend (which runs on one port) to talk to the backend (which runs on a different port)
const bodyParser = require("body-parser"); // parses the JSON body of incoming HTTP requests so that data is accessible 
const { OpenAI } = require("openai");

const app = express(); // creates instance of the express app, which will be the server
const port = 3001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors()); // Enable CORS so frontend can send requests to backend
app.use(bodyParser.json()); // tells express to automatically parse incoming request bodies as JSON. Without, req.body.message would be undefined

// LLM's behavior
const systemMessage = {
  role: "system",
  content:
    "You only answer questions related to programming, software development, or your own capabilities. If a user asks about anything else (like politics, personal opinions, religion, etc), politely decline and redirect them to ask about code or AI-related questions.",
};

// creates route to handle chat requests
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "No message sent" });

  // creates the message that will be sent to OpenAI. It contains the system role/context and the user input
  const messages = [systemMessage, { role: "user", content: userMessage }];

  // sends the message to OpenAI and waits for the response
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
    });

    const reply = completion.choices[0].message.content; // extracts the reply from OpenAI
    return res.json({ reply }); // sends reply to frontend (in JSON format)
  } 
  
  // error handling
  catch (err) {
    console.error("Error from OpenAI:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// tells app to start listening on port 3001
app.listen(port, () => {
  console.log(`LLM backend server running on http://localhost:${port}`);
});
