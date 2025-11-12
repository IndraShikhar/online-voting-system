import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../../client/src/auth/AuthContext";
import ProtectedRoute from "../../client/src/auth/ProtectedRoute";

import About from "../../client/src/pages/About";
import Contact from "../../client/src/pages/Contact";
import Home from "../../client/src/pages/Home";
import Login from "../../client/src/pages/Login";
import Register from "../../client/src/pages/Register";
import Create from "./Elections/create";

import AddCandidate from "../src/pages/adminCandidates/AddCandidate";
import AdminDashboard from "../src/pages/AdminDashboard";
import AdminProfile from "../src/pages/AdminProfile";
import CandidateList from "../src/pages/CandidateList";
// import CreateElection from "../pages/admin/CreateElection";
import EditElection from "../src/pages/EditElection";
import ElectionDetail from "../src/pages/ElectionDetail";
import ElectionList from "../src/pages/ElectionList";
import ResultOverview from "./pages/ResultOverview";
import VoterList from "../src/pages/admin/VoterList";

import VoterElectionDetail from "../src/pages/voter/ElectionDetail";
import VoterElectionList from "../src/pages/voter/ElectionList";
import VoterResultPage from "../src/pages/voter/ResultPage";
import VoteNow from "../src/pages/voter/VoteNow";
import VoterDashboard from "../src/pages/voter/VoterDashboard";
import VoterProfile from "../src/pages/voter/VoterProfile";

import NotFound from "../src/pages/NotFound";
import Unauthorized from "../src/pages/Unauthorized";

const router = createBrowserRouter([

  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },


  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "elections", element: <ElectionList /> },
      { path: "elections/create", element: <Create />},
      { path: "elections/:id", element: <ElectionDetail /> },
      { path: "elections/:id/edit", element: <EditElection /> },
      { path: "candidates", element: <CandidateList /> },
      { path: "candidates/add", element: <AddCandidate /> },
      { path: "voters", element: <VoterList /> },
      { path: "results", element: <ResultOverview /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
 
  {
    path: "/voter",
    element: (
      <ProtectedRoute allowedRoles={["voter"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <VoterDashboard /> },
      { path: "dashboard", element: <VoterDashboard /> },
      { path: "elections", element: <VoterElectionList /> },
      { path: "elections/:id", element: <VoterElectionDetail /> },
      { path: "vote/:id", element: <VoteNow /> },
      { path: "results/:id", element: <VoterResultPage /> },
      { path: "profile", element: <VoterProfile /> },
    ],
  },
 
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
