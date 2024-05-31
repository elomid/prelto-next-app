import useSWR from "swr";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import fetcher from "@/utils/fetcher";
import { Card } from "@/components/ui/card";

const PatternDetailsSheet = ({ pattern }) => {
  const { data, error } = useSWR(
    `/api/patterns/${pattern.id}/details`,
    fetcher
  );

  if (error) return <div>Failed to load pattern details.</div>;
  if (!data) return <div>Loading pattern details...</div>;

  const { posts, comments } = data;

  // Create a map of posts by their IDs
  const postsMap = new Map(posts.map((post) => [post.id, post]));

  // Group comments by postId
  const commentsByPostId = comments.reduce((acc, comment) => {
    const postId = comment.post?.id || comment.postId;
    if (!acc[postId]) {
      acc[postId] = {
        post: comment.post,
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
            {pattern.total_count} comments
          </div>
        </div>
        <div className="flex flex-col text-sm">
          {posts.map((post) => (
            <div key={post.id} className="border-b px-6 py-6">
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
            </div>
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
                    <div
                      key={comment.id}
                      className="p-5 border rounded-md bg-gray-50"
                    >
                      <p className="line-clamp-3">{comment.content}</p>
                    </div>
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
