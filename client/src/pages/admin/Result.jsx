import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function loadResults() {
      try {
        // fetch all elections first
        const res = await axios.get("/elections");
        const elections = res.data?.data?.elections || [];

        const resultsArray = await Promise.all(
          elections.map(async (ele) => {
            const id = ele.election_id;

            // 1) Primary: get votes per candidate for this election
            try {
              const { data } = await axios.get(`/votes/results/${id}`);
              if (data && data.status === "success" && Array.isArray(data.data) && data.data.length > 0) {
                // data.data is an array of candidates ordered by votes DESC (server-side)
                const candidates = data.data.map((c) => ({
                  ...c,
                  votes: Number(c.votes || 0),
                  vote_share: Number(c.vote_share || 0),
                }));

                const top = candidates[0];
                if (top && top.votes > 0) {
                  return buildElectionWithWinner(ele, {
                    name: top.name || top.username,
                    username: top.username,
                    votes: top.votes,
                    vote_share: top.vote_share || 0,
                    avatar: top.avatar_url,
                  });
                }

                // no votes yet
                return {
                  ...ele,
                  winner: null,
                  status: ele.status === "result_declared" || ele.status === "ended" ? "ended" : "no-result",
                };
              }
            } catch { /* ignore */ }

            // 2) If votes endpoint returned nothing useful but election has a declared winner id, fetch candidate detail
            if (ele.winner_candidate_id) {
              try {
                const { data: candRes } = await axios.get(`/candidates/${ele.winner_candidate_id}`);
                if (candRes && candRes.status === "success" && candRes.data) {
                  const c = candRes.data;
                  return buildElectionWithWinner(ele, {
                    name: c.name || c.username,
                    username: c.username,
                    votes: Number(c.votes || 0),
                    vote_share: Number(c.vote_share || 0),
                    avatar: c.avatar_url,
                  });
                }
              } catch { /* ignore */ }
            }

            // fallback when no endpoint returns useful data
            return {
              ...ele,
              winner: null,
              status: ele.status === "result_declared" || ele.status === "ended" ? "ended" : "no-result",
            };
          })
        );

        setResults(resultsArray);
      } catch (err) {
        console.error("Error loading results:", err);
        alert("Failed to load results.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function buildElectionWithWinner(ele, w) {
    return {
      ...ele,
      winner: {
        name: w.name || w.username || w.full_name || `${w.first_name || ""} ${w.last_name || ""}`.trim(),
        votes: Number(w.votes || 0),
        vote_share: Number(w.vote_share || 0),
        avatar: w.avatar || w.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || w.username || "Unknown")}`,
      },
      status: ele.status || "ended",
    };
  }

  if (loading) return <p className="text-center mt-10">Loading results...</p>;

  return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-8">Election Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 ">
        {results.map((ele) => (
          <Card
            key={ele.election_id}
            className="shadow border border-gray-100 hover:shadow-md transition rounded-xl"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{ele.title}</CardTitle>
              <p className="text-gray-600">{ele.description}</p>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 mt-3">
                <img
                  src={ele.winner?.avatar || "https://via.placeholder.com/80"}
                  alt="Winner"
                  className="w-20 h-20 object-cover rounded-full border shadow"
                />

                <div>
                  <p className="text-lg font-semibold">{ele.winner?.name || "No winner"}</p>
                  <p className="text-sm text-gray-600">
                    Votes: <span className="font-medium">{ele.winner?.votes ?? 0}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Vote Share: <span className="font-medium">{ele.winner?.vote_share ?? 0}%</span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    ele.status === "ended" || ele.status === "result_declared"
                      ? "bg-green-100 text-green-700"
                      : ele.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {(ele.status || "no-result").toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && (
          <p className="col-span-3 text-gray-500 text-center">No results available.</p>
        )}
      </div>
    </div>
  );
}
