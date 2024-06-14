import { useState } from "react";
import { formatDate } from "@/utils/dateUtils";

import { fetchResponse } from "@/utils/fetchUtils";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoaderBig from "./LoaderBig";

const Trends = ({ collectionId }) => {
  const [term, setTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchResponse({
        method: "GET",
        url: `/api/collections/${collectionId}/trend/${term}?period=week`,
      });
      setData(response);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter term..."
          className="rounded-full p-6"
        />
        <Button type="submit" style={{ width: "128px", height: "48px" }}>
          Search
        </Button>
      </form>
      {data && (
        <div className="bg-white border rounded-3xl p-16 mt-6">
          <ResponsiveContainer minHeight={360}>
            {isLoading ? (
              <div className="flex w-full h-full justify-center items-center p-8">
                <LoaderBig title="" />
              </div>
            ) : (
              <LineChart
                data={data.map((d) => ({
                  ...d,
                  date: formatDate(d.date),
                }))}
              >
                <XAxis dataKey="date" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: 0,
                    borderRadius: "10px",
                    color: "white",
                  }}
                />
                <Line
                  type="linear"
                  dataKey="count"
                  stroke="#1DCFC4"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Trends;
