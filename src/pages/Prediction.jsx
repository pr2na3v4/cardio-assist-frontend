/**
 * pages/Prediction.jsx
 * =======================
 * Prediction page: loads the patient list for the selector, submits to
 * POST /predict via <PredictionForm>, and renders the result in <RiskCard>.
 */

import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Seo from "../components/Seo";
import PredictionForm from "../components/PredictionForm";
import RiskCard from "../components/RiskCard";
import EmptyState from "../components/EmptyState";
import { useFetch } from "../hooks/useFetch";
import { getPatients } from "../services/api";

export default function Prediction() {
  const { data: patients, loading: patientsLoading } = useFetch(() => getPatients({ limit: 500 }), []);
  const [result, setResult] = useState(null);

  return (
    <AppLayout title="Predict Patient Risk" description="Run a K-Means risk prediction and auto-schedule the follow-up.">
      <Seo title="Predict Patient Risk" description="Run an AI-powered cardiac risk prediction using K-Means clustering." path="/predict" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink-800">Clinical inputs</h2>
          <p className="mt-1 text-sm text-ink-400">Select a patient and enter their latest vitals.</p>
          <div className="mt-5">
            <PredictionForm patients={patients ?? []} patientsLoading={patientsLoading} onResult={setResult} />
          </div>
        </div>

        <div>
          {result ? (
            <RiskCard result={result} />
          ) : (
            <div className="card h-full">
              <EmptyState
                title="No prediction yet"
                description="Fill out the clinical inputs and submit to see the patient's risk group, level, and recommended follow-up."
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
