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

const CreateCollectionForm = () => {
  const [collectionName, setProjectName] = useState("");
  const [subreddits, setSubreddits] = useState([""]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState(null);

  const router = useRouter();

  const handleAddSubreddit = () => {
    if (subreddits.length < 4) {
      setSubreddits([...subreddits, ""]);
    }
  };

  const handleRemoveSubreddit = (index) => {
    setSubreddits(subreddits.filter((_, i) => i !== index));
  };

  const handleCreateNewCollection = async () => {
    setCreationError(null);

    if (collectionName.trim().length < 1) {
      setCreationError("Collection name is required");
      return;
    }
    const validSubreddits = subreddits
      .filter((subreddit) => subreddit.trim() !== "")
      .map((filteredSubreddit) => filteredSubreddit.trim());

    if (validSubreddits.length === 0) {
      setCreationError("No subreddits provided");
      return;
    }
    if (validSubreddits.length > 4) {
      setCreationError("Cannot provide more than 4 subreddits per collection");
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
    <div className="max-w-[560px] mx-auto">
      <h1 className="text-xl font-medium tracking-tight mb-4">
        Create new collection
      </h1>
      {creationError && (
        <Alert variant="destructive" className="rounded-xl mb-4">
          <AlertTitle>Collection creation failed</AlertTitle>
          <AlertDescription>{creationError}</AlertDescription>
        </Alert>
      )}
      <Card className="rounded-3xl flex flex-col  overflow-hidden">
        <div className="grid gap-5 p-8">
          <div className="grid gap-1.5">
            <Label htmlFor="collectionName">Collection name</Label>
            <Input
              id="collectionName"
              value={collectionName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 subreddits-container">
            <div className="grid gap-1.5">
              <Label>Subreddits</Label>
              {subreddits.map((subreddit, index) => (
                <div className="flex gap-2" key={index}>
                  <Input
                    key={index}
                    id={`subreddit-${index}`}
                    value={subreddit}
                    onChange={(e) => {
                      const newSubreddits = [...subreddits];
                      newSubreddits[index] = e.target.value;
                      setSubreddits(newSubreddits);
                    }}
                  />
                  {subreddits.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-[40px] h-[40px] rounded-lg"
                      onClick={() => handleRemoveSubreddit(index)}
                    >
                      <Cross2Icon className="" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mr-auto text-xs mt-2"
              onClick={handleAddSubreddit}
              disabled={subreddits.length > 3}
            >
              + Add another
            </Button>
          </div>
        </div>

        <div className="flex gap-4 px-8 py-4 justify-end bg-gray-50 border-t">
          <Link href="/collections">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>

          <Button
            className="flex items-center gap-2"
            onClick={handleCreateNewCollection}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : `Create collection`}
            {!isCreating && (
              <div className="flex items-center gap-0.5 text-xs text-white/70">
                <div className="mt-[0.7px]">{subreddits.length * 100}</div>
                <IconCreditWhite />
              </div>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateCollectionForm;
