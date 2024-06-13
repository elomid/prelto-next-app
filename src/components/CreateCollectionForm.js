import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconCreditWhite } from "./icon";
import actionCosts from "@/constants/actionCosts";
import Image from "next/image";
import Loader from "./ui/Loader";

const CreateCollectionForm = () => {
  const [collectionName, setProjectName] = useState("");
  const [subreddits, setSubreddits] = useState([""]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return;
    }
    setIsSearchLoading(true);
    setSearchResults([]);
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/subreddits/search/${searchQuery.trim()}`
    );
    const data = await response.json();
    setSearchResults(data);
    setIsSearchLoading(false);
  };

  const router = useRouter();

  const handleAddSubreddit = (subreddit) => {
    if (selectedSubreddits.length < 3) {
      setSelectedSubreddits([...selectedSubreddits, subreddit]);
    }
  };

  const handleRemoveSubreddit = (subredditId) => {
    setSelectedSubreddits(
      selectedSubreddits.filter((subreddit) => subreddit.id !== subredditId)
    );
  };

  const handleCreateNewCollection = async () => {
    setCreationError(null);

    if (collectionName.trim().length < 1) {
      setCreationError("Collection name is required");
      return;
    }
    const validSubreddits = selectedSubreddits.map((subreddit) => subreddit.id);

    if (validSubreddits.length === 0) {
      setCreationError("At least 1 subreddit is required");
      return;
    }
    if (validSubreddits.length > 4) {
      setCreationError("Cannot provide more than 3 subreddits per collection");
      return;
    }
    setIsCreating(true);
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
          body: JSON.stringify({
            name: collectionName,
            subreddits: validSubreddits,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create collection";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("Error parsing server response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const collection = await response.json();
      router.push(`/collections/${collection.id}`);
    } catch (error) {
      console.error("Error creating collection:", error);
      setCreationError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      <h1 className="text-xl font-medium tracking-tight mb-4">
        Create new collection
      </h1>
      {creationError && (
        <Alert variant="destructive" className="rounded-xl mb-4">
          <AlertTitle>Collection creation failed</AlertTitle>
          <AlertDescription>{creationError}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-4 items-start">
        <Card className="rounded-3xl flex flex-col overflow-hidden flex-1">
          <div>
            <div className="flex flex-col gap-1.5 p-6">
              <Label htmlFor="collectionName">Collection name</Label>
              <Input
                id="collectionName"
                value={collectionName}
                onChange={(e) => setProjectName(e.target.value)}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col gap-2 subreddits-container">
              <div className="w-full">
                <div className="flex flex-col gap-1.5 p-6 pt-0">
                  <Label>Subreddits</Label>
                  <form className="flex gap-2" onSubmit={handleSearch}>
                    <Input
                      placeholder="Search subreddits by name or description..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      className="rounded-full"
                    />
                    <Button type="submit" disabled={isSearchLoading}>
                      Search
                    </Button>
                    {searchResults && searchResults.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </form>
                </div>
                <ul className="w-full p-6 flex flex-col gap-3">
                  {isSearchLoading && (
                    <div className="flex p-6 justify-center items-center">
                      <Loader />
                    </div>
                  )}
                  {searchResults.map((subreddit) => (
                    <li
                      key={subreddit.id}
                      className={`border px-6 p-4 flex flex-col gap-2 items-start overflow-hidden rounded-2xl ${
                        selectedSubreddits.find((s) => s.id === subreddit.id)
                          ? "border-[#028178] "
                          : null
                      }`}
                    >
                      {/* <Image
                        src={subreddit.community_icon}
                        width={100}
                        height={100}
                      /> */}
                      <h4 className="font-medium">
                        {subreddit.url.slice(0, subreddit.url.length - 1)}
                      </h4>
                      {/* <p className="text-sm text-gray-700">{subreddit.title}</p> */}
                      <p className="text-sm text-gray-700 whitespace-nowrap w-full overflow-hidden overflow-ellipsis">
                        {subreddit.public_description}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {subreddit.subscribers} members
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            selectedSubreddits.find(
                              (s) => s.id === subreddit.id
                            )
                          ) {
                            handleRemoveSubreddit(subreddit.id);
                          } else {
                            handleAddSubreddit(subreddit);
                          }
                        }}
                      >
                        {selectedSubreddits.find((s) => s.id === subreddit.id)
                          ? "Remove"
                          : "Select"}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl flex flex-col overflow-hidden min-w-96">
          <ul className="">
            {selectedSubreddits && selectedSubreddits.length > 0 && (
              <Label className="p-6 pb-2 block">Selected subreddits</Label>
            )}
            {selectedSubreddits &&
              selectedSubreddits.map((s, index) => (
                <li className="border-b px-6 py-4 flex justify-between items-center">
                  {s.name}
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveSubreddit(s.id)}
                    className="w-10 p-3"
                  >
                    <Cross2Icon />
                  </Button>
                </li>
              ))}
          </ul>
          <div className="flex gap-2 p-6 border-b flex-col">
            {/* <Link href="/collections">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link> */}

            <Button
              className="flex items-center gap-2"
              onClick={handleCreateNewCollection}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : `Create collection`}
              {!isCreating && (
                <div className="flex items-center gap-0.5 text-xs text-white/70">
                  <div className="mt-[0.7px]">
                    {selectedSubreddits.length * actionCosts.UPDATE_COLLECTION}
                  </div>
                  <IconCreditWhite />
                </div>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateCollectionForm;
