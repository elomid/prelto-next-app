import { useState } from "react";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import fetcher from "@/utils/fetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import PatternDetailsSheet from "./PatternDetailsSheet";
import { fetchResponse } from "@/utils/fetchUtils";
import { IconCreditWhite } from "./icon";
import LoaderBig from "@/components/LoaderBig";

function PatternsList({ collectionId }) {
  const [isCalculatingPatterns, setIsCalculatingPatterns] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  const {
    data: patterns,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/collections/${collectionId}/patterns`, fetcher);

  async function handleRecalculatePatterns() {
    setIsCalculatingPatterns(true);
    setCalculationError(null);

    try {
      await fetchResponse({
        method: "POST",
        url: `/api/collections/${collectionId}/calculate-patterns`,
        isProtected: true,
      });
      mutate();
    } catch (error) {
      console.error("Error:", error.message);
      if (error.status === 403) {
        setCalculationError(error.message);
      } else {
        setCalculationError(
          "An error occurred while calculating patterns. Please try again in a few seconds."
        );
      }
    } finally {
      setIsCalculatingPatterns(false);
    }
  }

  if (error) return <div>Failed to load patterns.</div>;
  if (isLoading) return <LoaderBig title="" text="" />;
  if (isCalculatingPatterns)
    return (
      <LoaderBig
        title={"Analyzing patterns"}
        text="This could take up to a couple of minutes."
      />
    );

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      {calculationError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to generate patterns</AlertTitle>
          <AlertDescription>{calculationError}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-6 w-full">
        <aside className="min-w-[240px] max-w-[240px] text-sm">
          <div className="flex flex-col gap-6">
            {patterns && patterns.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label>Generated on</Label>
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
            <Button
              size="sm"
              className="mr-auto text-xs flex items-center gap-2 px-4"
              onClick={handleRecalculatePatterns}
            >
              {isCalculatingPatterns ? "Finding patterns..." : `Find patterns`}
              {!isCalculatingPatterns && (
                <div className="flex items-center gap-0.5 text-xs text-white/70">
                  <div className="mt-[0.7px]">100</div>
                  <IconCreditWhite />
                </div>
              )}
            </Button>
          </div>
        </aside>
        <ul className="flex flex-col gap-3 w-full">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Card className="flex flex-col overflow-hidden p-6 cursor-pointer gap-3 w-full">
                    <div className="flex gap-2 items-center">
                      <h3 className="text-sm font-medium">{pattern.title}</h3>
                    </div>
                    <div className="text-xs text-[#017E76] font-semibold rounded-full px-2 py-1 bg-[#EEFBFA] flex justify-center items-center mr-auto">
                      {pattern.total_count}{" "}
                      {pattern.total_count === 1 ? "item" : "items"}
                    </div>
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
