import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateCollectionDialog = ({
  onCreateCollection,
  isLoading,
  variant = "secondary",
}) => {
  const [collectionName, setProjectName] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = () => {
    onCreateCollection({ name: collectionName, subreddits, topic });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant === "secondary" ? "outline" : ""}>
          Create collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid gap-1.5">
            <Label htmlFor="collectionName">Collection name</Label>
            <Input
              id="collectionName"
              value={collectionName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="subreddits">Subreddits</Label>
            <Input
              id="subreddits"
              value={subreddits}
              onChange={(e) => setSubreddits(e.target.value)}
              placeholder="Comma separated"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="topic">Topic (Optional)</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;
