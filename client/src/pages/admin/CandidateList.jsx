// src/pages/admin/ElectionCandidates.jsx

import { useEffect, useState } from 'react';
import axios from '../../api/api.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddnewCandidateForm from './AddnewCandidateForm.jsx';

export default function ElectionCandidates() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const { data } = await axios.get('/elections');
      let electionsData = data.data.elections;
      // fileter elections that are not active
      electionsData = electionsData.filter(
        (ele) => ele.status === 'upcoming'
      );
      console.log(electionsData);
      const electionWithCandidates = await Promise.all(
        electionsData.map(async (ele) => {
          try {
            const { data: res } = await axios.get(
              `/candidates/by-election/${ele.election_id}`
            );
            console.log(res);
            // If backend returns { status: "fail" }
            if (res.status === 'fail') {
              return {
                ...ele,
                candidates: [],
              };
            }

            ele.candidates = res.data;
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
      alert('Failed to load elections.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveCandidate(candidate_id) {
    if (!confirm('Remove this candidate from this election?')) return;

    try {
      await axios.delete(`/candidates/delete/${candidate_id}`);

      setElections((prev) =>
        prev.map((ele) => ({
          ...ele,
          candidates: ele.candidates.filter(
            (c) => c.candidate_id !== candidate_id
          ),
        }))
      );
    } catch (err) {
      console.log(err);
      alert('Failed to remove candidate');
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="m-5 ">
      <h2 className="text-3xl font-semibold mb-8">
        Manage Candidates by Election
      </h2>

      {/* 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 text-black ">
        {elections.length > 0 &&
          elections.map((ele) => (
            <Card
              key={ele.election_id}
              className="shadow border border-gray-100"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {ele.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{ele.description}</p>
              </CardHeader>

              <CardContent>
                <h4 className="font-semibold mb-2">Candidates</h4>

                {ele.candidates.length === 0 && (
                  <p className="text-sm text-black-500">No candidates yet.</p>
                )}

                <div className="space-y-3">
                  {ele.candidates.map((c, i) => {
                    console.log(`c-${i}`, c);
                    return (
                      <div
                        key={c.candidate_id}
                        className="flex justify-between text-black items-center bg-gray-50 p-2 rounded-md border"
                      >
                        <span className="font-medium">
                          {c.name}
                          <span className="text-gray-600 text-sm ml-1">
                            ({c.party})
                          </span>
                        </span>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCandidate(c.candidate_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Candidate Button */}
                <div className="mt-4 w-full">

                <AddnewCandidateForm  election={ele} />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
