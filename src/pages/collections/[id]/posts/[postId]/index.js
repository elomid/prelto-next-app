import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import CollectionLayout from "@/components/CollectionLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { fetchResponse } from "@/utils/fetchUtils";
import useRequireAuth from "@/hooks/useRequireAuth";
import { formatDate } from "@/utils/dateUtils";
import { Card } from "@/components/ui/card";
import { IconExternalLink } from "@/components/icon";

const PostPage = () => {
  const { user, isLoading, isError } = useRequireAuth();
  const router = useRouter();
  const { id: collectionId, postId } = router.query;
  const [revalidateInterval, setRevalidateInterval] = useState(0);
  const {
    data: collection,
    error: collectionError,
    mutate: mutateCollection,
  } = useSWR(
    collectionId ? `/api/collections/${collectionId}` : null,
    fetcher,
    {
      refreshInterval: revalidateInterval,
    }
  );
  const {
    data,
    error: postError,
    isLoading: isPostLoading,
    mutate: mutatePost,
  } = useSWR(
    collectionId && postId
      ? `/api/collections/${collectionId}/posts/${postId}`
      : null,
    fetcher,
    {
      refreshInterval: revalidateInterval,
    }
  );

  return (
    <CollectionLayout>
      <div className="some-container">
        <div className="flex flex-col gap-1 mb-8">
          {collection && (
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/collections">
                    Collections
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/collections/${collectionId}`}>
                    {collection.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
          {data && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 justify-between items-center">
                <h1 className="text-xl font-medium tracking-tight">
                  {data.post.title}
                </h1>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {data.post.author} • {" "}
                {formatDate(data.post.original_created_at)} • {data.post.ups}{" "}
                votes
              </div>
              <div className="my-4">{data.post.content}</div>
              <a
                size="sm"
                className="bg-white border rounded-full px-3 py-2 text-xs font-medium mr-auto flex items-center gap-2 min-w-0 hover:bg-gray-50"
                href={`https://www.reddit.com${data.post.permalink}`}
              >
                Open on Reddit <IconExternalLink />
              </a>
              {data.comments && (
                <ul className="flex flex-col gap-2 mt-8">
                  {data.comments.map((comment) => (
                    <Card key={comment.id} className="p-6 text-sm">
                      <div>{comment.content}</div>
                      <div className="text-sm text-gray-600 mt-3">
                        {comment.author} • {" "}
                        {formatDate(comment.original_created_at)} •{" "}
                        {comment.ups} votes
                      </div>
                    </Card>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </CollectionLayout>
  );
};

export default PostPage;
