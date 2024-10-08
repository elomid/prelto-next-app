import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import useRequireAuth from "@/hooks/useRequireAuth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";

export default function CollectionsPage() {
  const { user, isLoading, isError } = useRequireAuth();

  const {
    data: collections,
    isLoading: isCollectionsLoading,
    error: collectionsError,
  } = useSWR(
    user && user.id ? `/api/collections?userId=${user.id}` : null,
    fetcher
  );
  const router = useRouter();

  if (isLoading || !user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (isError) {
    console.error("Error in useRequireAuth", isError);
    router.push("/auth/login");
    return null;
  }

  const showEmptyState =
    !isCollectionsLoading && collections && collections.length === 0;

  return (
    <Layout>
      <div className="grid gap-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-medium tracking-tight">Collections</h1>

          {!showEmptyState && (
            <Link href="/collections/new">
              <Button variant="outline">Create collection</Button>
            </Link>
          )}
        </div>
        {showEmptyState ? (
          <EmptyState
            title="Create your first collection"
            message="Create a collection with the subreddits of your choosing to explore posts by categories, identify patterns, and uncover insights."
          >
            <div>
              <Link href="/collections/new">
                <Button>Create collection</Button>
              </Link>
            </div>
          </EmptyState>
        ) : (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {collections &&
              collections.map((collection) => (
                <Card
                  key={collection.id}
                  className="group border hover:bg-gray-50 transition-all rounded-3xl"
                >
                  <Link
                    href={`/collections/${collection.id}`}
                    className="flex flex-col p-8 h-full w-full"
                  >
                    <div className="gradient-fade overflow-hidden relative">
                      <div className="text-md font-medium">
                        {collection.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {collection.posts_count}{" "}
                        {collection.posts_count === 1 ? "Post" : "Posts"}
                      </div>
                      <div className="mt-8 flex gap-2">
                        {collection.subreddits &&
                          collection.subreddits.map((subreddit, index) => (
                            <Badge key={index}>{subreddit}</Badge>
                          ))}
                      </div>
                      <div className="absolute bottom-0 right-0 w-1/6 h-[30px] bg-gradient-to-r from-transparent to-white group-hover:to-gray-50 transition-all"></div>
                    </div>
                  </Link>
                </Card>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
