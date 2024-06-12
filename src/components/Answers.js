import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Markdown from "markdown-to-jsx";
import { fetchResponse } from "@/utils/fetchUtils";
import { Cross2Icon } from "@radix-ui/react-icons";

import styles from "./Answers.module.css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconCreditWhite } from "./icon";
import Loader from "@/components/ui/Loader";

function Answers({ collectionId }) {
  const [question, setQuestion] = useState(() => {
    return localStorage.getItem("question") || "";
  });
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("messages")) || [];
  });
  const [answer, setAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("question", question);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [question, messages]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "question", content: trimmedQuestion },
    ]);

    setError(null);
    setLoading(true);
    setQuestion("");

    try {
      const data = await fetchResponse({
        method: "POST",
        url: `/api/collections/${collectionId}/answer`,
        isProtected: true,
        body: { query: trimmedQuestion },
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "answer", content: data },
      ]);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-48">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to retrieve answer</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="messages-container flex-1 flex flex-col gap-3 overflow-hidden">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-8 text-sm  ${
              message.type == "question"
                ? " font-regular bg-gray-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <Markdown className={`whitespace-pre-wrap ${styles.markdown}`}>
              {message.content}
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
            className="flex items-center gap-2"
            onClick={handleAskQuestion}
            disabled={loading}
            style={{ width: "160px", height: "48px" }}
          >
            {loading ? (
              <Loader trackColor="#eaeaef80" spinnerColor="white" />
            ) : (
              `Submit`
            )}
            {!loading && (
              <div className="flex items-center gap-0.5 text-xs text-white/70">
                <div className="mt-[0.7px]">10</div>
                <IconCreditWhite />
              </div>
            )}
          </Button>
          {messages?.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              className="w-[56px] h-[48px] rounded-full"
              onClick={() => {
                setQuestion("");
                setMessages([]);
                localStorage.removeItem("question");
                localStorage.removeItem("results");
              }}
            >
              <Cross2Icon className="" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Answers;
