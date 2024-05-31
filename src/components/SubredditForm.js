import { useState } from "react";

const SubredditForm = ({ onSubmit }) => {
  const [subreddit, setSubreddit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(subreddit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={subreddit}
        onChange={(e) => setSubreddit(e.target.value)}
        placeholder="Enter subreddit"
      />
      <button type="submit">Fetch Posts</button>
    </form>
  );
};

export default SubredditForm;
