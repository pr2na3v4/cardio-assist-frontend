/**
 * pages/Home.jsx
 * ================
 * Public marketing landing page: hero, features, benefits, how-it-works.
 * Uses semantic HTML (section/h1-h3 hierarchy) and the PulseLine signature
 * element to open with the most characteristic thing in this product's
 * world - a live cardiac trace.
 */

import { Link } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import PulseLine from "../components/PulseLine";

const FEATURES = [
  { title: "AI Patient Segmentation", desc: "Every patient is scored against five clinically distinct risk profiles the moment new vitals come in.", icon: SegmentIcon },
  { title: "K-Means Clustering", desc: "A trained clustering model reads age, blood pressure, cholesterol, heart rate, and ST depression together — not in isolation.", icon: ClusterIcon },
  { title: "Automated Follow-Ups", desc: "Risk level sets the cadence automatically: daily for critical, weekly for high, monthly or quarterly otherwise.", icon: CalendarIcon },
  { title: "Reminder Scheduling", desc: "Each follow-up carries its own reminder, queued the instant the risk group is assigned.", icon: BellIcon },
  { title: "Patient Analytics", desc: "Track risk distribution and prediction trends across your entire patient panel at a glance.", icon: ChartIcon },
  { title: "Healthcare Dashboard", desc: "One screen for census, risk mix, and today's follow-up load — built for a shift handoff.", icon: GridIcon },
];

const BENEFITS = [
  { title: "Early Risk Detection", desc: "Surface deteriorating patients before symptoms escalate into an emergency visit." },
  { title: "Personalized Care", desc: "Follow-up frequency and recommendations adapt to each patient's actual risk group." },
  { title: "Hospital Resource Optimization", desc: "Direct staff attention to critical and high-risk patients first, automatically." },
  { title: "Preventive Healthcare", desc: "Shift cardiology from reactive treatment toward continuous, proactive monitoring." },
  { title: "Patient Monitoring", desc: "Every prediction and follow-up is logged, giving your team a full longitudinal view." },
];

const STEPS = [
  { title: "Patient Data Entry", desc: "Register a patient and capture their latest vitals: age, blood pressure, cholesterol, heart rate, ST depression." },
  { title: "AI Risk Segmentation", desc: "A trained K-Means model scores the patient against five clinical clusters." },
  { title: "Risk Classification", desc: "The cluster maps to a clear risk level — Healthy, Moderate, High, or Critical." },
  { title: "Follow-Up Scheduling", desc: "A follow-up date is generated automatically, cadence set by risk level." },
  { title: "Reminder Generation", desc: "A reminder is queued for the patient's care team ahead of the follow-up." },
  { title: "Healthcare Management", desc: "Your dashboard reflects the change instantly — census, risk mix, and today's workload." },
];

export default function Home() {
  return (
    <MarketingLayout>
      <Seo
        title="AI-Powered Cardiac Risk Segmentation & Follow-Up Management"
        description="CardioAssist AI segments cardiac patients into risk groups using K-Means machine learning and automatically schedules follow-ups and reminders."
        path="/"
      />

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden bg-ink-800">
        <div className="section relative z-10 grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
              AI-Powered Cardiac Risk Segmentation and Follow-Up Management
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
              Transform cardiac patient management with AI
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-100/75 sm:text-lg">
              Automatically segment patients into risk groups, monitor health status, and manage follow-ups using
              machine learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predict" className="btn-accent">
                Predict Patient Risk
              </Link>
              <Link to="/dashboard" className="btn bg-white/10 text-white hover:bg-white/15">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass-dark rounded-xl2 p-6 shadow-glass sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Live risk trace</p>
                  <p className="mt-1 font-mono text-sm text-white/80">Patient #A184 · Critical Cardiac Risk Group</p>
                </div>
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-pulse-500" aria-hidden="true" />
              </div>
              <PulseLine variant="hero" className="mt-4 h-28 w-full" color="#E33F5C" />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <MiniStat label="BPM" value="142" />
                <MiniStat label="BP" value="168/98" />
                <MiniStat label="Next check" value="24h" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FEATURES ============================== */}
      <section id="features" className="section section-y">
        <SectionHeading eyebrow="Capabilities" title="Everything a cardiac care team needs, in one place" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, desc, icon: Icon }) => (
            <div key={title} className="card card-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink-50 text-ink-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-800">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== BENEFITS ============================== */}
      <section className="bg-ink-50/60">
        <div className="section section-y">
          <SectionHeading eyebrow="Outcomes" title="Built for measurable clinical impact" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card p-5">
                <h3 className="font-display text-base font-semibold text-ink-800">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== HOW IT WORKS ============================== */}
      <section id="how-it-works" className="section section-y">
        <SectionHeading eyebrow="Process" title="How CardioAssist AI works" />
        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="font-mono text-sm font-semibold text-pulse-500">Step {i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink-800">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="section pb-20 sm:pb-28">
        <div className="rounded-xl2 bg-ink-700 px-8 py-14 text-center shadow-lift sm:px-16">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to bring AI risk segmentation to your care team?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-100/75 sm:text-base">
            Register your first patient and generate a risk prediction in under a minute.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/patients" className="btn-accent">
              Add a Patient
            </Link>
            <Link to="/predict" className="btn bg-white/10 text-white hover:bg-white/15">
              Predict Patient Risk
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-pulse-600">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">{title}</h2>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 py-2.5">
      <p className="font-mono text-base font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-white/50">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline icons (no external icon library dependency)
// ---------------------------------------------------------------------------
function SegmentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ClusterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M3 13h4l2-6 4 12 2-8 2 4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v3M16 3v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 19a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
