/**
 * components/PredictionForm.jsx
 * ================================
 * Prediction form: patient selector (the backend's POST /predict requires
 * a patient_id) plus the five clinical inputs - Age, Blood Pressure,
 * Cholesterol, Heart Rate, OldPeak. Submits to POST /predict and hands the
 * result up to the Prediction page for display in <RiskCard>.
 */

import { useForm } from "react-hook-form";
import { predictRisk } from "../services/api";
import { useToast } from "../hooks/useToast.jsx";

export default function PredictionForm({ patients = [], patientsLoading, onResult }) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { patient_id: "", age: "", trestbps: "", chol: "", thalach: "", oldpeak: "" },
  });

  async function onSubmit(values) {
    try {
      const result = await predictRisk({
        patient_id: values.patient_id,
        age: Number(values.age),
        trestbps: Number(values.trestbps),
        chol: Number(values.chol),
        thalach: Number(values.thalach),
        oldpeak: Number(values.oldpeak),
      });
      toast.success("Risk prediction complete — follow-up scheduled automatically.");
      onResult?.(result);
    } catch (err) {
      toast.error(err.message || "Couldn't generate a prediction. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="patient_id" className="field-label">
          Patient
        </label>
        <select
          id="patient_id"
          className="field-input"
          disabled={patientsLoading}
          aria-invalid={!!errors.patient_id}
          aria-describedby={errors.patient_id ? "patient-error" : undefined}
          {...register("patient_id", { required: "Select a patient." })}
          defaultValue=""
        >
          <option value="" disabled>
            {patientsLoading ? "Loading patients…" : "Select a patient"}
          </option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — age {p.age}
            </option>
          ))}
        </select>
        {errors.patient_id && (
          <p id="patient-error" className="field-error" role="alert">
            {errors.patient_id.message}
          </p>
        )}
        {!patientsLoading && patients.length === 0 && (
          <p className="mt-1.5 text-xs text-ink-400">No patients yet — add one on the Patients page first.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          id="age"
          label="Age"
          placeholder="58"
          register={register("age", {
            required: "Required.",
            min: { value: 0, message: "Can't be negative." },
            max: { value: 130, message: "Too high." },
          })}
          error={errors.age}
        />
        <NumberField
          id="trestbps"
          label="Blood pressure (mm Hg)"
          placeholder="130"
          register={register("trestbps", { required: "Required.", min: { value: 1, message: "Must be positive." } })}
          error={errors.trestbps}
        />
        <NumberField
          id="chol"
          label="Cholesterol (mg/dl)"
          placeholder="240"
          register={register("chol", { required: "Required.", min: { value: 1, message: "Must be positive." } })}
          error={errors.chol}
        />
        <NumberField
          id="thalach"
          label="Max heart rate"
          placeholder="150"
          register={register("thalach", { required: "Required.", min: { value: 1, message: "Must be positive." } })}
          error={errors.thalach}
        />
        <div className="col-span-2">
          <NumberField
            id="oldpeak"
            label="OldPeak (ST depression)"
            placeholder="1.4"
            step="0.1"
            register={register("oldpeak", { required: "Required.", min: { value: 0, message: "Can't be negative." } })}
            error={errors.oldpeak}
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-accent w-full disabled:opacity-60">
        {isSubmitting ? "Analyzing…" : "Predict patient risk"}
      </button>
    </form>
  );
}

function NumberField({ id, label, placeholder, step = "1", register, error }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        placeholder={placeholder}
        className="field-input font-mono"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register}
      />
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
