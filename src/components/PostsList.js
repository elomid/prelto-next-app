import { useState, useCallback } from "react";
import useSWR from "swr";
import { formatDate } from "@/utils/dateUtils";
import { Card } from "@/components/ui/card";

import useDebounce from "@/hooks/useDebounce";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import fetcher from "@/utils/fetcher";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { IconExternalLink } from "@/components/icon";
import Highlighter from "react-highlight-words";
import Link from "next/link";

const PostsList = ({ posts, collectionId }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, error } = useSWR(
    debouncedSearchQuery
      ? `/api/collections/${collectionId}/search?query=${debouncedSearchQuery}`
      : null,
    fetcher
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.categories.includes(selectedCategory))
    : posts;

  const displayedPosts = searchQuery
    ? searchResults?.posts || []
    : filteredPosts;
  const displayedComments = searchQuery ? searchResults?.comments || [] : [];

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-6 min-w-0 w-full">
        <div>
          <Input
            type="text"
            placeholder="Search posts and comments"
            className="rounded-full p-6"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <ul className="flex flex-col gap-3">
          {searchQuery && displayedPosts.length > 0 && (
            <div className="flex items-center gap-1 text-sm">
              Posts{" "}
              <div className="flex items-center pt-[5px] font-medium  text-gray-800 justify-center text-center text-xs px-1 py-1 bg-gray-200 rounded-full min-w-5 h-5">
                {displayedPosts.length}
              </div>
            </div>
          )}
          {displayedPosts &&
            displayedPosts.length > 0 &&
            displayedPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/collections/${collectionId}/posts/${post.reddit_name}`}
                >
                  <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-3 bg-white hover:bg-gray-50">
                    <h3 className="font-medium text-sm">
                      {/* <Highlighter
                        searchWords={escapeRegExp(searchQuery).split(" ")}
                        textToHighlight={post.title}
                        highlightClassName="bg-[#a0f8f3]"
                      /> */}
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-700 no-wrap overflow-ellipsis whitespace-nowrap overflow-hidden">
                      {/* <Highlighter
                        searchWords={escapeRegExp(searchQuery).split(" ")}
                        textToHighlight={post.content}
                        highlightClassName="bg-[#a0f8f3]"
                      /> */}
                      {post.content}
                    </p>
                    <div className="flex text-xs items-centers justify-between">
                      <div className="flex gap-1">
                        <Badge className="text-xs">{post.subreddit}</Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(post.original_created_at)} • {post.ups}{" "}
                        votes • {post.comments_count} comments
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          {searchQuery && displayedComments.length > 0 && (
            <div className="flex items-center gap-1 text-sm mt-4">
              Comments{" "}
              <div className="flex items-center pt-[5px] font-medium  text-gray-800 justify-center text-center text-xs px-1 py-1 bg-gray-200 rounded-full min-w-5 h-5">
                {displayedComments.length}
              </div>
            </div>
          )}
          {displayedComments &&
            displayedComments.length > 0 &&
            displayedComments.map((comment) => (
              <li key={comment.id}>
                <Link
                  href={`/collections/${collectionId}/posts/${comment.post_reddit_name}`}
                >
                  <Card className="flex flex-col overflow-hidden gap-3">
                    <div className="p-6 py-4 font-medium text-xs bg-slate-100">
                      {comment && comment.title && comment.title}
                    </div>
                    <div className="p-6 pt-3">
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const Comments = ({ postId, searchQuery }) => {
  const swrKey = postId ? `/api/posts/${postId}/comments` : null;
  const { data: comments, error, isLoading } = useSWR(swrKey, fetcher);

  if (error) return <div>Failed to load comments.</div>;
  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="mt-4">
      <h4 className="font-medium">Comments</h4>
      <ul className="mt-2">
        {comments &&
          comments.map((comment) => (
            <li key={comment.id} className="mb-2">
              <p>
                <Highlighter
                  searchWords={[searchQuery]}
                  textToHighlight={comment.content}
                />
              </p>
              <small className="text-gray-500">
                {formatDate(comment.created_at)}
              </small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PostsList;
