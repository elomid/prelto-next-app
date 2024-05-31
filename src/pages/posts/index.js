import { useState } from "react";
import useSWR from "swr";
import SubredditForm from "@/components/SubredditForm";
import PostsList from "@/components/PostsList";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PostsPage = () => {
  const [subreddit, setSubreddit] = useState("");
  const { data, error } = useSWR(
    subreddit
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${subreddit}`
      : null,
    fetcher
  );

  const handleSubmit = (subreddit) => {
    setSubreddit(subreddit);
  };

  return (
    <div>
      <h1>Subreddit Posts</h1>
      <SubredditForm onSubmit={handleSubmit} />
      {error && <div>Failed to load posts.</div>}
      {data && <PostsList posts={data} />}
    </div>
  );
};

export default PostsPage;
