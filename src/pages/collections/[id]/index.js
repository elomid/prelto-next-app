import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import PostsList from "@/components/PostsList";
import Answers from "@/components/Answers";
import PatternsList from "@/components/PatternsList";
import CollectionLayout from "@/components/CollectionLayout";
import Loader from "@/components/Loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { fetchResponse } from "@/utils/fetchUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CollectionPage = () => {
  const router = useRouter();
  const { id, tab = "posts" } = router.query;
  const [revalidateInterval, setRevalidateInterval] = useState(0);
  const {
    data: collection,
    error: collectionError,
    mutate: mutateCollection,
  } = useSWR(id ? `/api/collections/${id}` : null, fetcher, {
    refreshInterval: revalidateInterval,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Connecting to Reddit..."
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState(collection?.name); // TODO: fix this
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState(null);

  const { data: posts, error: postsError } = useSWR(
    id && collection?.status === "POSTS_FETCHED"
      ? `/api/collections/${id}/posts`
      : null,
    fetcher,
    { refreshInterval: revalidateInterval }
  );

  useEffect(() => {
    if (collection) {
      switch (collection.status) {
        case "DRAFT":
          setLoadingMessage("Connecting to Reddit...");
          setRevalidateInterval(5000);
          break;
        case "FETCHING_POSTS":
          setLoadingMessage("Retrieving data from Reddit...");
          setRevalidateInterval(5000);
          break;
        case "POSTS_FETCHED":
          setLoadingMessage("");
          setRevalidateInterval(0);
          break;
        default:
          setRevalidateInterval(0);
      }
    }
  }, [collection]);

  const handleTabChange = (value) => {
    router.push(`/collections/${id}?tab=${value}`, undefined, {
      shallow: true,
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchResponse({
        method: "DELETE",
        url: `/api/collections/${id}`,
      });

      router.push("/collections");
    } catch (error) {
      console.error("Error:", error.message);
      setRenameError(error.message);
    } finally {
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };

  const handleRename = async () => {
    setIsRenaming(true);
    setRenameError(null);
    try {
      await fetchResponse({
        method: "PUT",
        url: `/api/collections/${id}/rename`,
        isProtected: true,
        body: { name: newCollectionName },
      });
    } catch (error) {
      console.error("Error:", error.message);
      setRenameError(error.message);
    }
    setIsRenaming(false);
    setIsRenameDialogOpen(false);
    mutateCollection();
  };

  return (
    <CollectionLayout>
      {collectionError || postsError ? (
        <div>Failed to load collection or posts.</div>
      ) : !collection ? (
        <div>Loading...</div>
      ) : (
        <div className="some-container">
          <div className="flex flex-col gap-1 mb-8">
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/collections">
                    Collections
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{collection.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex gap-2 justify-between items-center">
              <h1 className="text-3xl font-medium tracking-tight">
                {collection.name}
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="">
                  <Button variant="outline" className="text-xs">
                    Actions <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={isRenaming}
                    onSelect={() => setIsRenameDialogOpen(true)}
                  >
                    {isRenaming ? "Renaming..." : "Rename"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDeleting}
                    onSelect={() => setIsDeleteDialogOpen(true)}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {renameError && (
              <Alert variant="destructive" className="mt-6">
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>Please try again</AlertDescription>
              </Alert>
            )}
          </div>
          {collection.status !== "POSTS_FETCHED" ? (
            <div className="flex bg-gray-100 justify-center items-center p-16 rounded-3xl">
              <Loader color="#D7D0BC" text={loadingMessage} />
            </div>
          ) : (
            <Tabs.Root
              value={tab}
              onValueChange={handleTabChange}
              className="tabs-root"
            >
              <Tabs.List className="flex gap-6 border-b mb-6">
                <Tabs.Trigger
                  value="posts"
                  className={`border-b-4  py-4 font-medium transition-all ${
                    tab === "posts"
                      ? " border-black text-black"
                      : " border-transparent text-gray-600"
                  }`}
                >
                  Posts
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="patterns"
                  className={`border-b-4  py-4 font-medium  transition-all ${
                    tab === "patterns"
                      ? " border-black text-black"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Patterns
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="answers"
                  className={`border-b-4  py-4 font-medium  transition-all ${
                    tab === "answers"
                      ? " border-black text-black"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  Answers
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="posts">
                {posts ? (
                  <PostsList posts={posts} collectionId={id} />
                ) : (
                  <div>Loading posts...</div>
                )}
              </Tabs.Content>
              <Tabs.Content value="patterns">
                <PatternsList collectionId={id} />
              </Tabs.Content>
              <Tabs.Content value="answers" className="answers-content">
                <Answers collectionId={id} />
              </Tabs.Content>
            </Tabs.Root>
          )}
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>Delete</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <p className="pt-6">
              Are you sure you want to delete this collection? This action
              cannot be undone.
            </p>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {collection && collection.name && (
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogTrigger asChild>Rename</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Collection</DialogTitle>
            </DialogHeader>
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <DialogFooter className="mt-3">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename} disabled={isRenaming}>
                {isRenaming ? "Renaming..." : "Rename"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </CollectionLayout>
  );
};

export default CollectionPage;
