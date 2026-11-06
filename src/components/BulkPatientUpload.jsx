/**
 * components/BulkPatientUpload.jsx
 * ====================================
 * Admin bulk-import flow for patients: upload a .csv, .xlsx, .xls, or .txt
 * file, preview + validate every row client-side, then submit valid rows
 * to POST /patients in small concurrent batches with a live progress bar
 * and a final per-row success/failure report.
 *
 * Flow: idle -> preview (parsed + validated, awaiting confirmation)
 *            -> importing (batched submission, progress bar)
 *            -> done (summary + per-row error list)
 */

import { useCallback, useRef, useState } from "react";
import { createPatient } from "../services/api";
import { useToast } from "../hooks/useToast.jsx";
import { downloadPatientTemplate, parsePatientFile, validatePatientRows } from "../utils/patientFileImport";
import { runInBatches } from "../utils/runInBatches";

const ACCEPTED_EXTENSIONS = ".csv,.xlsx,.xls,.txt";
const PREVIEW_ROW_LIMIT = 8;

export default function BulkPatientUpload({ onImported }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | preview | importing | done
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [importResults, setImportResults] = useState(null); // { succeeded: [], failed: [] }

  const reset = useCallback(() => {
    setFileName(null);
    setParseError(null);
    setValidRows([]);
    setInvalidRows([]);
    setPhase("idle");
    setProgress({ done: 0, total: 0 });
    setImportResults(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  async function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    setParseError(null);
    setParsing(true);
    try {
      const rows = await parsePatientFile(file);
      const { valid, invalid } = validatePatientRows(rows);
      setValidRows(valid);
      setInvalidRows(invalid);
      setPhase("preview");
      if (valid.length === 0) {
        toast.error("No valid rows found in that file — check the column headers and try again.");
      }
    } catch (err) {
      setParseError(err.message || "Couldn't read that file.");
      setPhase("idle");
    } finally {
      setParsing(false);
    }
  }

  function onInputChange(e) {
    const file = e.target.files?.[0];
    handleFile(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  async function startImport() {
    setPhase("importing");
    setProgress({ done: 0, total: validRows.length });

    const results = await runInBatches(
      validRows,
      (row) =>
        createPatient({
          name: row.name,
          email: row.email,
          phone: row.phone,
          age: Number(row.age),
        }),
      {
        concurrency: 3,
        onItemDone: () => setProgress((p) => ({ ...p, done: p.done + 1 })),
      }
    );

    const succeeded = [];
    const failed = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") succeeded.push(result.value);
      else failed.push({ row: validRows[index], message: result.error?.message || "Failed to create patient." });
    });

    setImportResults({ succeeded, failed });
    setPhase("done");

    if (succeeded.length > 0) {
      toast.success(`Imported ${succeeded.length} patient${succeeded.length === 1 ? "" : "s"} successfully.`);
      onImported?.(succeeded);
    }
    if (failed.length > 0) {
      toast.error(`${failed.length} row${failed.length === 1 ? "" : "s"} failed to import.`);
    }
  }

  // ------------------------------------------------------------------- idle
  if (phase === "idle") {
    return (
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center rounded-xl2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragActive ? "border-pulse-500 bg-pulse-50" : "border-surface-border bg-ink-50/40"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-500 shadow-soft">
            <UploadIcon />
          </span>
          <p className="mt-3 text-sm font-medium text-ink-700">
            Drag a file here, or{" "}
            <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-pulse-600 hover:underline">
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-ink-400">CSV, Excel (.xlsx/.xls), or TXT — columns: name, email, phone, age</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={onInputChange}
            className="sr-only"
            aria-label="Upload patient file"
          />
          {parsing && <p className="mt-3 text-xs font-medium text-ink-500">Reading {fileName}…</p>}
        </div>

        {parseError && (
          <p role="alert" className="field-error mt-3">
            {parseError}
          </p>
        )}

        <button type="button" onClick={downloadPatientTemplate} className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-700">
          <DownloadIcon />
          Download a template file
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------- preview
  if (phase === "preview") {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-ink-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <FileIcon />
            <span className="font-medium">{fileName}</span>
          </div>
          <button type="button" onClick={reset} className="text-xs font-medium text-ink-400 hover:text-ink-700">
            Choose a different file
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <SummaryPill tone="healthy" label="Valid rows" value={validRows.length} />
          <SummaryPill tone="critical" label="Rows with errors" value={invalidRows.length} />
        </div>

        {validRows.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-ink-50/60 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th scope="col" className="px-3 py-2.5">Name</th>
                  <th scope="col" className="px-3 py-2.5">Email</th>
                  <th scope="col" className="px-3 py-2.5">Phone</th>
                  <th scope="col" className="px-3 py-2.5">Age</th>
                </tr>
              </thead>
              <tbody>
                {validRows.slice(0, PREVIEW_ROW_LIMIT).map((row, i) => (
                  <tr key={i} className="border-b border-surface-border last:border-0">
                    <td className="px-3 py-2.5 text-ink-800">{row.name}</td>
                    <td className="px-3 py-2.5 text-ink-500">{row.email}</td>
                    <td className="px-3 py-2.5 text-ink-500">{row.phone}</td>
                    <td className="px-3 py-2.5 font-mono text-ink-600">{row.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validRows.length > PREVIEW_ROW_LIMIT && (
              <p className="border-t border-surface-border px-3 py-2 text-xs text-ink-400">
                + {validRows.length - PREVIEW_ROW_LIMIT} more row{validRows.length - PREVIEW_ROW_LIMIT === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}

        {invalidRows.length > 0 && (
          <div className="mt-4 rounded-lg border border-risk-critical/25 bg-risk-critical-bg px-4 py-3">
            <p className="text-xs font-semibold text-risk-critical">{invalidRows.length} row{invalidRows.length === 1 ? "" : "s"} will be skipped</p>
            <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-ink-700">
              {invalidRows.slice(0, 6).map(({ row, index, errors }) => (
                <li key={index}>
                  Row {index + 2} ({row.name || row.email || "unnamed"}): {errors.join(", ")}
                </li>
              ))}
              {invalidRows.length > 6 && <li>+ {invalidRows.length - 6} more…</li>}
            </ul>
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={startImport} disabled={validRows.length === 0} className="btn-accent flex-1 disabled:opacity-50">
            Import {validRows.length} patient{validRows.length === 1 ? "" : "s"}
          </button>
          <button type="button" onClick={reset} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- importing
  if (phase === "importing") {
    const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
    return (
      <div className="py-6 text-center">
        <p className="text-sm font-medium text-ink-700">
          Importing patients… {progress.done} / {progress.total}
        </p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-pulse-500 transition-all duration-200" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink-400">Don't close this tab while the import is running.</p>
      </div>
    );
  }

  // -------------------------------------------------------------------- done
  if (phase === "done" && importResults) {
    return (
      <div>
        <div className="flex flex-wrap gap-3">
          <SummaryPill tone="healthy" label="Imported" value={importResults.succeeded.length} />
          <SummaryPill tone="critical" label="Failed" value={importResults.failed.length} />
        </div>

        {importResults.failed.length > 0 && (
          <div className="mt-4 rounded-lg border border-risk-critical/25 bg-risk-critical-bg px-4 py-3">
            <p className="text-xs font-semibold text-risk-critical">These rows didn't import</p>
            <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-ink-700">
              {importResults.failed.map(({ row, message }, i) => (
                <li key={i}>
                  {row.name || row.email}: {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" onClick={reset} className="btn-primary mt-5 w-full">
          Upload another file
        </button>
      </div>
    );
  }

  return null;
}

function SummaryPill({ tone, label, value }) {
  const toneClasses = tone === "healthy" ? "text-risk-healthy bg-risk-healthy-bg" : "text-risk-critical bg-risk-critical-bg";
  return (
    <div className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${toneClasses}`}>
      <span className="font-mono text-sm">{value}</span>
      {label}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11M12 15l-4-4M12 15l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3.5h8l4 4V19a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 19V5A1.5 1.5 0 016 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}