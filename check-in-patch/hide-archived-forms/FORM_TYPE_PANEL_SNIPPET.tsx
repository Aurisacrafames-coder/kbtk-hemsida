/**
 * Referenssnippet rekonstruerad från produktionsbundle
 * (FormTypePanel / minifierat `tr` i 16hpd5if8p.ng.js).
 *
 * Klistra in logiken i källfilen i kbtk-checkin — importer och
 * propnamn kan skilja sig något från denna skiss.
 */

type FormStatus = 'new' | 'in_progress' | 'done' | 'archived';
type StatusFilter = 'all' | FormStatus;

const STATUS_ORDER: FormStatus[] = ['new', 'in_progress', 'done', 'archived'];

const STATUS_LABEL: Record<FormStatus, string> = {
  new: 'Ny',
  in_progress: 'Pågår',
  done: 'Klar',
  archived: 'Arkiverad',
};

type Submission = {
  id: string;
  form_type: string;
  status: FormStatus;
  created_at: string;
};

function matchesStatusFilter(entry: Submission, statusFilter: StatusFilter) {
  if (statusFilter === 'all') {
    return entry.status !== 'archived';
  }
  return entry.status === statusFilter;
}

export function useVisibleSubmissions(
  submissions: Submission[],
  formType: string,
  statusFilter: StatusFilter,
) {
  return submissions
    .filter((s) => s.form_type === formType)
    .filter((s) => matchesStatusFilter(s, statusFilter))
    .sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
    );
}

export function activeSubmissionCount(
  submissions: Submission[],
  formType: string,
) {
  return submissions.filter(
    (s) => s.form_type === formType && s.status !== 'archived',
  ).length;
}

/** Statusselect — byt "Alla" → "Aktiva" */
export function StatusFilterSelect(props: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-lund-ink">Filtrera status</span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as StatusFilter)}
        className="rounded-lg border border-lund-border bg-lund-surface px-3 py-2"
      >
        <option value="all">Aktiva</option>
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABEL[status]}
          </option>
        ))}
      </select>
    </label>
  );
}
