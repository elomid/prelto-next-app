import useSWR from "swr";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import LoaderBig from "./LoaderBig";

const PatternDetailsSheet = ({ pattern }) => {
  const { data, isLoading, error } = useSWR(
    `/api/patterns/${pattern.id}/details`,
    fetcher
  );

  if (error) return <div>Failed to load pattern details.</div>;
  if (isLoading) return;
  if (!data) return <div>Loading pattern details...</div>;

  const { posts, comments } = data;

  // Create a map of posts by their IDs
  const postsMap = new Map(posts.map((post) => [post.id, post]));

  //TODO: simplify this commentByPostId logic
  //TODO: better UI for showing comments and posts invidiually and as a group inside the sheet

  // Group comments by postId
  const commentsByPostId = comments.reduce((acc, comment) => {
    const postId = comment.post_reddit_name;
    const postTitle = comment.post_title || comment.postTitle;
    const collectionId = 36;
    if (!acc[postId]) {
      acc[postId] = {
        post: { id: postId, title: postTitle, collection_id: collectionId },
        comments: [],
      };
    }
    acc[postId].comments.push(comment);
    return acc;
  }, {});

  return (
    <SheetContent side="right" className="p-0">
      <SheetHeader className="p-6">
        <SheetTitle>{pattern.title}</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 px-6 mb-2">
          <div className="text-sm">{pattern.summary}</div>
          <div className="text-xs text-[#017E76] font-semibold rounded-full px-2 py-1 bg-[#EEFBFA] flex justify-center items-center mr-auto">
            {pattern.total_count} items
          </div>
        </div>
        <div className="flex flex-col text-sm">
          {posts.map((post) => (
            <Link
              href={`/collections/${post.collection_id}/posts/${post.reddit_name}`}
              key={post.id}
              className="border-b px-6 py-6 bg-red-white hover:bg-gray-50"
            >
              <div>
                <h4 className="font-medium">{post.title}</h4>
                {post.content && <p className="line-clamp-3">{post.content}</p>}
                {commentsByPostId[post.id] && (
                  <div className="flex flex-col gap-3 text-sm mt-3">
                    {commentsByPostId[post.id].comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-5 border rounded-md bg-gray-50"
                      >
                        <p className="line-clamp-3">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
          {Object.entries(commentsByPostId)
            .filter(([postId]) => !postsMap.has(postId))
            .map(([postId, { post, comments }]) => (
              <div key={postId} className="border-b px-6 py-6">
                <h4 className="font-medium">
                  {post?.title || "Post not available"}
                </h4>
                <div className="flex flex-col gap-3 text-sm mt-3">
                  {comments.map((comment) => (
                    <Link
                      href={`/collections/${post.collection_id}/posts/${postId}`}
                      key={comment.id}
                      className="p-5 border rounded-md bg-white hover:bg-gray-50"
                    >
                      <p className="line-clamp-3">{comment.content}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </SheetContent>
  );
};

export default PatternDetailsSheet;
