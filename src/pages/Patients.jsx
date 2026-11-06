/**
 * pages/Patients.jsx
 * =====================
 * Patient Management: registration form (POST /patients) alongside a
 * searchable, paginated patient list (GET /patients).
 */

import { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Seo from "../components/Seo";
import PatientForm from "../components/PatientForm";
import BulkPatientUpload from "../components/BulkPatientUpload";
import PatientTable from "../components/tables/PatientTable";
import Pagination from "../components/Pagination";
import ErrorState from "../components/ErrorState";
import { useFetch } from "../hooks/useFetch";
import { usePagination } from "../hooks/usePagination";
import { getPatients } from "../services/api";

const ADD_MODES = [
  { id: "single", label: "Add Patient" },
  { id: "bulk", label: "Bulk Upload" },
];

export default function Patients() {
  const { data: patients, loading, error, refetch } = useFetch(() => getPatients({ limit: 500 }), []);
  const [search, setSearch] = useState("");
  const [addMode, setAddMode] = useState("single");

  const filtered = useMemo(() => {
    if (!patients) return [];
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  }, [patients, search]);

  const pagination = usePagination(filtered, 8);

  function handleCreated() {
    refetch();
  }

  return (
    <AppLayout title="Patient Management" description="Register patients and keep your care roster current.">
      <Seo title="Patient Management" description="Register cardiac patients and manage your care roster." path="/patients" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-2 rounded-full bg-ink-50 p-1" role="tablist" aria-label="Add patients">
              {ADD_MODES.map((m) => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={addMode === m.id}
                  onClick={() => setAddMode(m.id)}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    addMode === m.id ? "bg-white text-ink-800 shadow-soft" : "text-ink-400 hover:text-ink-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {addMode === "single" ? (
              <>
                <h2 className="font-display text-lg font-semibold text-ink-800">Register a patient</h2>
                <p className="mt-1 text-sm text-ink-400">Add someone new to your care roster.</p>
                <div className="mt-5">
                  <PatientForm onCreated={handleCreated} />
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-lg font-semibold text-ink-800">Bulk import patients</h2>
                <p className="mt-1 text-sm text-ink-400">
                  Upload a CSV, Excel, or TXT file — admins can add many patients at once instead of one at a time.
                </p>
                <div className="mt-5">
                  <BulkPatientUpload onImported={handleCreated} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex flex-col gap-3 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-800">Patient roster</h2>
                <p className="text-xs text-ink-400">{filtered.length} patient{filtered.length === 1 ? "" : "s"}</p>
              </div>
              <div className="relative sm:w-64">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    pagination.resetPage();
                  }}
                  placeholder="Search by name or email"
                  aria-label="Search patients"
                  className="field-input pl-9"
                />
              </div>
            </div>

            {error ? (
              <ErrorState message={error.message} onRetry={refetch} />
            ) : (
              <>
                <PatientTable patients={filtered} loading={loading} pagination={pagination} />
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPrev={pagination.prevPage} onNext={pagination.nextPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}