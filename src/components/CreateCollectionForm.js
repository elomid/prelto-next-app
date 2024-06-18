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
import { fetchResponse } from "@/utils/fetchUtils";
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
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    if (searchQuery.trim() === "") {
      return;
    }
    setIsSearchLoading(true);
    setSearchResults([]);
    setHasSearched(true);

    try {
      const data = await fetchResponse({
        method: "POST",
        url: `/api/subreddits/search`,
        isProtected: true,
        body: { query: searchQuery.trim() },
      });

      setSearchResults(data);
    } catch (error) {
      console.error("Error:", error);
      setSearchError("Something went wrong. Please try again.");
    } finally {
      setIsSearchLoading(false);
    }
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
      <div className="flex gap-2 items-center mb-4">
        <Link href="/collections">
          <Button variant="outline" size="sm" className="text-sm px-4">
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-medium tracking-tight">
          Create collection
        </h1>
      </div>
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
                      placeholder="Search subreddits..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      className="rounded-full"
                      required
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
                          setHasSearched(false);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </form>
                </div>
                {searchError && (
                  <div className="mx-6 mb-6 px-4 py-3 bg-red-50 rounded-lg text-sm text-red-600">
                    {searchError}
                  </div>
                )}
                {(hasSearched || isSearchLoading) && !searchError && (
                  <ul className="w-full p-6 flex flex-col gap-3">
                    {hasSearched &&
                      searchResults.length === 0 &&
                      !isSearchLoading && (
                        <p className="text-sm text-center">No matches found</p>
                      )}
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
                        <div className="flex gap-2 items-center ">
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
                            disabled={
                              selectedSubreddits.length >= 3 &&
                              !selectedSubreddits.find(
                                (s) => s.id === subreddit.id
                              )
                            }
                          >
                            {selectedSubreddits.find(
                              (s) => s.id === subreddit.id
                            )
                              ? "Remove"
                              : "Select"}
                          </Button>
                          {selectedSubreddits.length >= 3 &&
                            !selectedSubreddits.find(
                              (s) => s.id === subreddit.id
                            ) && (
                              <div className="rounded-full bg-gray-100 text-xs text-gray-700 p-2 px-4">
                                Can't select more than 3 subreddits
                              </div>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-3xl flex flex-col overflow-hidden min-w-96">
          <ul className="p-6 flex flex-col gap-4 pb-0">
            {selectedSubreddits && <Label className="">Selection</Label>}
            {selectedSubreddits && selectedSubreddits.length === 0 && (
              <div className="bg-gray-100 p-6 py-8 rounded-lg text-sm  justify-center text-center flex flex-col gap-1.5">
                <Label>No subreddits selected</Label>
                <p className="text-gray-700">
                  Select upt to 3 subreddits to continue
                </p>
              </div>
            )}
            {selectedSubreddits &&
              selectedSubreddits.map((s, index) => (
                <li className="border rounded-lg px-6 py-4 flex justify-between items-center">
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
