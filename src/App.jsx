/**
 * App.jsx
 * ========
 * Top-level route table.
 *   /            -> Home (marketing landing page)
 *   /dashboard   -> Dashboard
 *   /patients    -> Patient Management
 *   /predict     -> Prediction
 *   /followups   -> Follow-Ups
 *   /history     -> History
 *   *            -> 404
 */

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Prediction from "./pages/Prediction";
import FollowUps from "./pages/FollowUps";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/predict" element={<Prediction />} />
      <Route path="/followups" element={<FollowUps />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
