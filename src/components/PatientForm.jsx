/**
 * components/PatientForm.jsx
 * =============================
 * Patient registration form: Name, Email, Phone, Age. Validated with
 * react-hook-form, submits via POST /patients.
 */

import { useForm } from "react-hook-form";
import { createPatient } from "../services/api";
import { useToast } from "../hooks/useToast.jsx";

export default function PatientForm({ onCreated }) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", phone: "", age: "" } });

  async function onSubmit(values) {
    try {
      const patient = await createPatient({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        age: Number(values.age),
      });
      toast.success(`${patient.name} was added to your patient list.`);
      reset();
      onCreated?.(patient);
    } catch (err) {
      toast.error(err.message || "Couldn't create the patient. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="field-label">
          Full name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Jane Whitfield"
          className="field-input"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name", { required: "Enter the patient's full name.", minLength: { value: 2, message: "Name is too short." } })}
        />
        {errors.name && (
          <p id="name-error" className="field-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="jane.whitfield@email.com"
          className="field-input"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", {
            required: "Enter an email address.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
          })}
        />
        {errors.email && (
          <p id="email-error" className="field-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="field-label">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 555 0100"
            className="field-input"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone", { required: "Enter a phone number.", minLength: { value: 5, message: "Too short." } })}
          />
          {errors.phone && (
            <p id="phone-error" className="field-error" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="age" className="field-label">
            Age
          </label>
          <input
            id="age"
            type="number"
            placeholder="58"
            className="field-input"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? "age-error" : undefined}
            {...register("age", {
              required: "Enter the patient's age.",
              min: { value: 0, message: "Age can't be negative." },
              max: { value: 130, message: "Enter a realistic age." },
            })}
          />
          {errors.age && (
            <p id="age-error" className="field-error" role="alert">
              {errors.age.message}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? "Adding patient…" : "Add patient"}
      </button>
    </form>
  );
}
