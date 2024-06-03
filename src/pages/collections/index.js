import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import useRequireAuth from "@/hooks/useRequireAuth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { Badge } from "@/components/ui/badge";

export default function CollectionsPage() {
  const { user, isLoading, isError } = useRequireAuth();

  const [isLoadingCollectionCreation, setIsLoadingCollectionCreation] =
    useState(false);

  const { data: collections, error: collectionsError } = useSWR(
    user && user.id ? `/api/collections?userId=${user.id}` : null,
    fetcher
  );
  const router = useRouter();

  const handleCreateNewCollection = async (data) => {
    setIsLoadingCollectionCreation(true);
    const { token } = parseCookies();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      const collection = await response.json();
      router.push(`/collections/${collection.id}`);
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setIsLoadingCollectionCreation(false);
    }
  };

  if (isLoading || !user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (isError)
    return (
      <Layout>
        <div>Failed to load user.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="grid gap-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-medium tracking-tight">Collections</h1>
          <CreateCollectionDialog
            onCreateCollection={handleCreateNewCollection}
            isLoading={isLoadingCollectionCreation}
          />
        </div>
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
                    <div className="text-md font-medium">{collection.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {collection.subredditCount}{" "}
                      {collection.subredditCount === 1
                        ? "Subreddit"
                        : "Subreddits"}{" "}
                      • 
                      {collection.postCount}{" "}
                      {collection.postCount === 1 ? "Post" : "Posts"}
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
      </div>
    </Layout>
  );
}
