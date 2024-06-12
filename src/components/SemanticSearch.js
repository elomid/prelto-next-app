import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Markdown from "markdown-to-jsx";
import { fetchResponse } from "@/utils/fetchUtils";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { formatDate } from "@/utils/dateUtils";

import styles from "./Answers.module.css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loader from "@/components/ui/Loader";

function SemanticSearch({ collectionId }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSubmitSemanticSearch = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await fetchResponse({
        method: "POST",
        url: `/api/collections/${collectionId}/semantic-search`,
        isProtected: true,
        body: { query: trimmedQuestion },
      });
      setResults(data);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-48">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to retrieve results</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="posts-container flex-1 flex flex-col gap-3 overflow-hidden"></div>
      <form
        className="flex gap-2 items-center justify-between  w-full max-w-[1208px] mb-6"
        onSubmit={handleSubmitSemanticSearch}
      >
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. users talking about their furstrations with software..."
          className="rounded-full p-6"
        />

        <Button
          className="flex items-center gap-2"
          disabled={loading}
          style={{ width: "128px", height: "48px" }}
          type="submit"
        >
          {loading ? (
            <Loader trackColor="#eaeaef80" spinnerColor="white" />
          ) : (
            `Search`
          )}
        </Button>
      </form>

      <ul className="flex flex-col gap-3">
        {results.map((result) => {
          if (result.type === "post") {
            return <PostListItem post={result} collectionId={collectionId} />;
          } else if (result.type === "comment") {
            return (
              <CommentListItem comment={result} collectionId={collectionId} />
            );
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  );
}

export default SemanticSearch;

function PostListItem({ post, collectionId }) {
  return (
    <li key={post.id}>
      <Link href={`/collections/${collectionId}/posts/${post.reddit_name}`}>
        <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-3 bg-white hover:bg-gray-50">
          <h3 className="font-medium text-sm">{post.title}</h3>
          <p className="text-sm text-gray-700 no-wrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            {post.content}
          </p>
          <div className="flex text-xs items-centers justify-between">
            <div className="text-xs text-gray-500">
              {formatDate(post.original_created_at)} • {post.ups} votes •{" "}
              {post.comments_count} comments
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}

function CommentListItem({ comment, collectionId }) {
  return (
    <li key={comment.id}>
      <Link
        href={`/collections/${collectionId}/posts/${comment.post_reddit_name}`}
      >
        <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-3 bg-white hover:bg-gray-50">
          <p className="text-sm text-gray-700 no-wrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            {comment.content}
          </p>
          <div className="flex text-xs items-centers justify-between">
            <div className="text-xs text-gray-500">
              {formatDate(comment.original_created_at)} • {comment.ups} votes
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}
