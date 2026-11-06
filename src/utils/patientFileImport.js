/**
 * utils/patientFileImport.js
 * =============================
 * Parses a CSV, TXT, or Excel (.xlsx/.xls) file into an array of patient
 * rows, normalizes flexible column headers (e.g. "Full Name" / "phone
 * number" / "Age") to the shape POST /patients expects, and validates
 * each row before it's ever sent to the backend.
 *
 * The backend has no bulk-create endpoint, so BulkPatientUpload.jsx uses
 * this module to get clean rows, then submits them one at a time (in
 * small concurrent batches) against the existing POST /patients endpoint.
 */

import Papa from "papaparse";

export const REQUIRED_FIELDS = ["name", "email", "phone", "age"];

// Accepted header spellings per field, matched after lowercasing and
// stripping non-alphanumeric characters (so "Full Name", "full_name",
// and "FullName" all resolve to the same "name" field).
const FIELD_ALIASES = {
  name: ["name", "fullname", "patientname"],
  email: ["email", "emailaddress", "mail"],
  phone: ["phone", "phonenumber", "mobile", "contact", "contactnumber"],
  age: ["age", "patientage"],
};

function normalizeKey(key) {
  return String(key ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function mapRawRowToPatient(rawRow) {
  const normalizedEntries = Object.entries(rawRow).map(([k, v]) => [normalizeKey(k), v]);
  const patient = {};
  for (const field of REQUIRED_FIELDS) {
    const match = normalizedEntries.find(([k]) => FIELD_ALIASES[field].includes(k));
    patient[field] = match && match[1] != null ? String(match[1]).trim() : "";
  }
  return patient;
}

/** Parses a .csv or .txt file (comma or tab delimited - Papa auto-detects). */
function parseDelimited(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data.map(mapRawRowToPatient)),
      error: (err) => reject(new Error(err.message || "Couldn't parse that file.")),
    });
  });
}

/** Parses a .xlsx or .xls file's first sheet. xlsx is dynamically imported
 * so its ~800KB doesn't bloat the main bundle for users who never touch
 * the bulk-upload feature. */
async function parseSpreadsheet(file) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("The workbook doesn't contain any sheets.");
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows.map(mapRawRowToPatient);
}

const EXTENSION_PARSERS = {
  csv: parseDelimited,
  txt: parseDelimited,
  xlsx: parseSpreadsheet,
  xls: parseSpreadsheet,
};

/** Parses any supported patient import file into normalized row objects. */
export async function parsePatientFile(file) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const parser = EXTENSION_PARSERS[ext];
  if (!parser) {
    throw new Error("Unsupported file type. Upload a .csv, .xlsx, .xls, or .txt file.");
  }
  const rows = await parser(file);
  if (rows.length === 0) {
    throw new Error("No rows were found in that file.");
  }
  return rows;
}

/** Validates one normalized row, returning a list of human-readable problems (empty = valid). */
export function validatePatientRow(row) {
  const errors = [];

  if (!row.name || row.name.length < 2) errors.push("Missing or invalid name");
  if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push("Missing or invalid email");
  if (!row.phone || row.phone.length < 5) errors.push("Missing or invalid phone");

  const age = Number(row.age);
  if (row.age === "" || Number.isNaN(age) || age < 0 || age > 130) errors.push("Missing or invalid age");

  return errors;
}

/** Runs validation across all parsed rows, returning { valid, invalid } lists. */
export function validatePatientRows(rows) {
  const valid = [];
  const invalid = [];
  rows.forEach((row, index) => {
    const errors = validatePatientRow(row);
    if (errors.length === 0) valid.push(row);
    else invalid.push({ row, index, errors });
  });
  return { valid, invalid };
}

/** Triggers a browser download of a sample CSV template with the expected columns. */
export function downloadPatientTemplate() {
  const csv = "name,email,phone,age\nJane Whitfield,jane.whitfield@email.com,+1-555-0100,58\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cardioassist-patient-import-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}