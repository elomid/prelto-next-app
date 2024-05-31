import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import styles from "./Answers.module.css"; // Import the CSS module

function Answers({ collectionId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessages((messages) => [
      ...messages,
      { type: "question", content: question },
    ]);
    setQuestion("");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections/${collectionId}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question }),
      }
    );
    const data = await response.json();
    setMessages((messages) => [...messages, { type: "answer", content: data }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-48">
      <div className="messages-container flex-1 flex flex-col gap-3 overflow-hidden">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`border rounded-lg p-8 text-sm  ${
              message.type == "question"
                ? " font-medium bg-gray-300 text-black"
                : "bg-white text-gray-700"
            }`}
          >
            <Markdown className={`whitespace-pre-wrap ${styles.markdown}`}>
              {message.content.replace(/\n\s*\n/g, "\n")}
            </Markdown>
          </div>
        ))}
      </div>
      <div className="question-container fixed bottom-0 left-32 right-16 flex">
        <div className="bg-white p-8 flex gap-2 items-center justify-between shadow-2xl rounded-3xl rounded-br-none rounded-bl-none border border-b-0 w-full max-w-[1208px] ">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here"
            className="rounded-full p-6"
          />
          <Button
            onClick={handleAskQuestion}
            size="lg"
            className="p-6"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Answers;
