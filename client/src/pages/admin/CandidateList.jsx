// src/pages/admin/ElectionCandidates.jsx

import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ElectionCandidates() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
  try { 
    const { data } = await axios.get("/elections");
    const electionsData = data.data.elections;
 
    const electionWithCandidates = await Promise.all(
      electionsData.map(async (ele) => {
        try {
          const { data: res } = await axios.get(`/candidates/by-election/${ele.election_id}`);

          // If backend returns { status: "fail" }
          if (res.status === "fail") {
            return {
              ...ele,
              candidates: [],
            };
          }

          return {
            ...ele,
            candidates: res.data || [],
          };

        } catch (err) {
          console.warn(
            `Failed to load candidates for election ${ele.election_id}`
          );

          // If API fails, return empty candidates
          return {
            ...ele,
            candidates: [],
          };
        }
      })
    );

    setElections(electionWithCandidates);
  } catch (err) {
    console.log(err);
    alert("Failed to load elections.");
  } finally {
    setLoading(false);
  }
}

  async function handleRemoveCandidate(election_id, candidate_id) {
    if (!confirm("Remove this candidate from this election?")) return;

    try {
      await axios.delete(`/candidates/${candidate_id}?election_id=${election_id}`);

      // remove candidate locally
      setElections((prev) =>
        prev.map((e) =>
          e.election_id === election_id
            ? { ...e, candidates: e.candidates.filter((c) => c.candidate_id !== candidate_id) }
            : e
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to remove candidate");
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-8">Manage Candidates by Election</h2>

      {/* 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        { elections.length === 0 ? <p className="text-center mt-10">No elections found.</p> : elections.map((ele) => (
          <Card key={ele.election_id} className="shadow border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {ele.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{ele.description}</p>
            </CardHeader>

            <CardContent>
              <h4 className="font-semibold mb-2">Candidates</h4>

              {ele.candidates.length === 0 && (
                <p className="text-sm text-gray-500">No candidates yet.</p>
              )}

              <div className="space-y-3">
                {ele.candidates.map((c) => (
                  <div
                    key={c.candidate_id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md border"
                  >
                    <span className="font-medium">{c.name}</span>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemoveCandidate(ele.election_id, c.candidate_id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
