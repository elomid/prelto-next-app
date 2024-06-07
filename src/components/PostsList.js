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

const PostsList = ({ posts, collectionId }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, error } = useSWR(
    debouncedSearchQuery
      ? `/api/collections/${collectionId}/posts/search?query=${debouncedSearchQuery}`
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
      <aside className="min-w-[240px] text-sm">
        <ul className="flex flex-col gap-1">
          {[
            {
              label: "All posts",
              value: null,
            },
            {
              label: "Pain points",
              value: "Pain point",
            },
            {
              label: "Solution requests",
              value: "Solution request",
            },
            {
              label: "Habits and preferences",
              value: "Habits and preferences",
            },
            {
              label: "Product feedback",
              value: "Product feedback",
            },
          ].map(({ label, value }) => (
            <li key={label}>
              <button
                className={`flex w-full h-full justify-between items-center px-4 py-3 rounded-full transition-al ${
                  selectedCategory === value
                    ? "bg-[#000] text-white"
                    : "text-gray-700 hover:bg-[#F0F4F4]"
                }`}
                onClick={() => handleCategoryClick(value)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex flex-col gap-6 min-w-0 w-full">
        <div>
          <Input
            type="text"
            placeholder="Search posts and comments"
            className="rounded-full px-6"
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-3">
                      <h3 className="font-medium text-sm">
                        <Highlighter
                          searchWords={searchQuery.replace(/"/g, "").split(" ")}
                          textToHighlight={post.title}
                          highlightClassName="bg-[#a0f8f3]"
                        />
                      </h3>
                      <p className="text-sm text-gray-700 no-wrap overflow-ellipsis whitespace-nowrap overflow-hidden">
                        <Highlighter
                          searchWords={searchQuery.replace(/"/g, "").split(" ")}
                          textToHighlight={post.content}
                          highlightClassName="bg-[#a0f8f3]"
                        />
                      </p>
                      <div className="flex text-xs items-centers justify-between">
                        <div className="flex gap-1">
                          <Badge className="text-xs">{post.subreddit}</Badge>
                          {post.categories &&
                            post.categories.length > 0 &&
                            post.categories.map((category) => (
                              <Badge
                                key={category}
                                variant="outline"
                                className="text-xs"
                              >
                                {category}
                              </Badge>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(post.original_created_at)} • {post.ups}{" "}
                          votes
                        </div>
                      </div>
                    </Card>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader className="mb-6">
                      <SheetTitle>{post.title}</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-4">
                      <div>{post.content}</div>
                      <a
                        variant="outline"
                        size="sm"
                        className="border rounded-full px-3 py-2 text-xs font-medium mr-auto flex items-center gap-2"
                        href={`https://www.reddit.com${post.permalink}`}
                      >
                        Open on Reddit <IconExternalLink />
                      </a>
                      <Comments postId={post.id} searchQuery={searchQuery} />
                    </div>
                  </SheetContent>
                </Sheet>
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
                <Card className="flex flex-col overflow-hidden gap-3">
                  <div className="p-6 py-4 font-medium text-xs bg-slate-100">
                    {comment && comment.title && comment.title}
                  </div>
                  <div className="p-6 pt-3">
                    <p className="text-sm text-gray-700">
                      <Highlighter
                        searchWords={searchQuery.replace(/"/g, "").split(" ")}
                        textToHighlight={comment.content}
                        highlightClassName="bg-[#a0f8f3]"
                      />
                    </p>
                  </div>
                </Card>
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
