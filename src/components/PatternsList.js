import { useState } from "react";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import fetcher from "@/utils/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import PatternDetailsSheet from "./PatternDetailsSheet";

function PatternsList({ collectionId }) {
  const [isCalculatingPatterns, setIsCalculatingPatterns] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  const {
    data: patterns,
    error,
    mutate,
  } = useSWR(`/api/collections/${collectionId}/patterns`, fetcher);

  function handleRecalculatePatterns() {
    setIsCalculatingPatterns(true);
    setCalculationError(null);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections/${collectionId}/calculate-patterns`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to recalculate patterns");
        }
        mutate();
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        setCalculationError(
          "An error occurred while calculating patterns. Please try again in a few seconds."
        );
      })
      .finally(() => {
        setIsCalculatingPatterns(false);
      });
  }

  if (error) return <div>Failed to load patterns.</div>;
  if (!patterns) return <div>Loading patterns...</div>;
  if (isCalculatingPatterns) return <div>Recalculating patterns...</div>;

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      {calculationError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to calculate patterns</AlertTitle>
          <AlertDescription>{calculationError}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-6">
        <aside className="min-w-[240px] max-w-[240px] text-sm">
          <div className="flex flex-col gap-6">
            {patterns && patterns.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label>Calculated on</Label>
                <div className="text-gray-700">
                  {new Date(patterns[0].created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>Patterns found</Label>
              <div className="text-gray-700">{patterns.length}</div>
            </div>
            <Button className="mr-auto" onClick={handleRecalculatePatterns}>
              {isCalculatingPatterns
                ? "Recalculating..."
                : "Re-calculate patterns"}
            </Button>
          </div>
        </aside>
        <ul className="flex flex-col gap-3">
          {patterns.map((pattern) => (
            <li key={pattern.id}>
              <Sheet>
                <SheetTrigger asChild>
                  <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-6">
                    <div className="flex gap-2 items-center">
                      <CommentCount count={pattern.total_count} />
                      <h3 className="text-sm font-medium">{pattern.title}</h3>
                    </div>
                    <p className="text-sm overflow-ellipsis overflow-hidden text-gray-700">
                      {pattern.summary}
                    </p>
                  </Card>
                </SheetTrigger>
                <PatternDetailsSheet pattern={pattern} />
              </Sheet>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PatternsList;

function CommentCount({ count }) {
  return (
    <div className="text-xs text-[#01988E] font-semibold rounded-full px-2 py-1 bg-[#EAFAF9] flex justify-center items-center">
      {count}
    </div>
  );
}
