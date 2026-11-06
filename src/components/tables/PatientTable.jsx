/**
 * components/tables/PatientTable.jsx
 * =====================================
 * Patient list table: search by name/email, paginated.
 */

import { formatDate } from "../../utils/dateUtils";
import EmptyState from "../EmptyState";
import { SkeletonTableRows } from "../Skeleton";

export default function PatientTable({ patients, loading, pagination }) {
  if (loading) {
    return (
      <table className="w-full text-left text-sm">
        <TableHead />
        <tbody>
          <SkeletonTableRows rows={6} cols={5} />
        </tbody>
      </table>
    );
  }

  if (patients.length === 0) {
    return <EmptyState title="No patients found" description="Try a different search, or add a new patient to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <TableHead />
        <tbody>
          {pagination.pageItems.map((p) => (
            <tr key={p.id} className="border-b border-surface-border last:border-0 hover:bg-ink-50/50">
              <td className="px-4 py-3.5 font-medium text-ink-800">{p.name}</td>
              <td className="px-4 py-3.5 text-ink-500">{p.email}</td>
              <td className="px-4 py-3.5 text-ink-500">{p.phone}</td>
              <td className="px-4 py-3.5 font-mono text-ink-600">{p.age}</td>
              <td className="px-4 py-3.5 text-ink-400">{formatDate(p.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead() {
  return (
    <thead>
      <tr className="border-b border-surface-border text-xs font-semibold uppercase tracking-wide text-ink-400">
        <th scope="col" className="px-4 py-3">Name</th>
        <th scope="col" className="px-4 py-3">Email</th>
        <th scope="col" className="px-4 py-3">Phone</th>
        <th scope="col" className="px-4 py-3">Age</th>
        <th scope="col" className="px-4 py-3">Registered</th>
      </tr>
    </thead>
  );
}
