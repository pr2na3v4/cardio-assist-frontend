/**
 * services/api.js
 * ================
 * Centralized Axios instance for all backend communication.
 *
 * Scoped deliberately to the 7 endpoints the backend currently exposes:
 *   GET  /dashboard/stats
 *   POST /patients
 *   GET  /patients
 *   POST /predict
 *   GET  /history
 *   GET  /followups
 *   GET  /followups/today
 *
 * Base URL comes from VITE_API_URL (see .env.example), so switching
 * between local/staging/production backends never requires code changes.
 * A response interceptor normalizes every error into a consistent shape
 * so pages can handle loading/error/success state identically.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Normalizes any Axios error into a predictable shape for UI consumption. */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const message =
      (typeof data?.detail === "string" && data.detail) ||
      (Array.isArray(data?.detail) && data.detail.map((d) => d.msg).join(", ")) ||
      "Something went wrong on the server. Please try again.";
    return { message, status, details: data };
  }
  if (error.request) {
    return {
      message: "Can't reach the server. Check your connection and try again.",
      status: 0,
      details: null,
    };
  }
  return { message: error.message || "An unexpected error occurred.", status: -1, details: null };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------
export const getPatients = (params = {}) => apiClient.get("/patients", { params }).then((r) => r.data);
export const createPatient = (payload) => apiClient.post("/patients", payload).then((r) => r.data);

// ---------------------------------------------------------------------------
// Prediction
// ---------------------------------------------------------------------------
export const predictRisk = (payload) => apiClient.post("/predict", payload).then((r) => r.data);

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------
export const getHistory = (params = {}) => apiClient.get("/history", { params }).then((r) => r.data);

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------
export const getFollowups = (params = {}) => apiClient.get("/followups", { params }).then((r) => r.data);
export const getTodaysFollowups = () => apiClient.get("/followups/today").then((r) => r.data);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export const getDashboardStats = () => apiClient.get("/dashboard/stats").then((r) => r.data);

export default apiClient;
