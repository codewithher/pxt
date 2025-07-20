require('dotenv').config();
const readline = require('readline');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const messages = [
  { role: "system", content: "You only answer questions related to programming, software development, or your own capabilities. If a user asks about anything else (like politics, personal opinions, religion, etc), politely decline and redirect them to ask about code or AI-related questions." }
];

async function askQuestion() {
  rl.question("You: ", async (input) => {
    messages.push({ role: "user", content: input });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: messages
      });

      const reply = completion.choices[0].message.content;
      console.log("AI:", reply);
      messages.push({ role: "assistant", content: reply });

      askQuestion(); // Loop
    } catch (err) {
      console.error("Error:", err);
      rl.close();
    }
  });
}

askQuestion();
