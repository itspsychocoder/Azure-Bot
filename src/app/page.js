"use client"
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { useState } from "react";

const endpoint = "https://testbot001.cognitiveservices.azure.com/openai/deployments/testbot0089";
const modelName = "gpt-4o-mini";




export default function Home() {
  const [messages, setMessages] = useState([
    { role:"system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    console.log(messages)
    main(newMsgs);
    setInput("");
  };
  const main = async (newMsgs) => {
    const client = new ModelClient(endpoint, new AzureKeyCredential("6nfUK2yAHW5iuMbmvmvicqyL5CZCbkWVJB77mMrLNuRQJYLkkYHMJQQJ99BCACYeBjFXJ3w3AAAAACOGSZEe")); 
  
    const response = await client.path("/chat/completions").post({
      body: {
        messages: newMsgs,
        max_tokens: 4096,
        temperature: 1,
        top_p: 1,
        model: modelName,
      },
    });
  
    if (response.status !== "200") {
      throw response.body.error;
    }
  
    let newMsg = response.body.choices[0].message.content;
  
    // Use functional state update to avoid stale state issues
    setMessages((prevMessages) => [...prevMessages, { role: "system", content: newMsg }]);
  };
  
 
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
    <div className="h-64 overflow-y-auto p-2 bg-white rounded-lg mb-4">
      {messages.map((msg, index) => (
        <Message key={index} text={msg.content} sender={msg.role} />
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  </div>

  );
}
const Message = ({ text, sender }) => {
  return (
    <div
      className={`p-2 my-1 max-w-[80%] rounded-lg text-white ${
    sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-500"
      }`}
    >
      {text}
    </div>
  );
};
