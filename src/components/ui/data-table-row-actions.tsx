"use client";

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: TData;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      {onView ? (
        <button
          className="text-sm underline"
          onClick={() => onView(row)}
          type="button"
        >
          View
        </button>
      ) : null}
      {onEdit ? (
        <button
          className="text-sm underline"
          onClick={() => onEdit(row)}
          type="button"
        >
          Edit
        </button>
      ) : null}
      {onDelete ? (
        <button
          className="text-sm text-destructive underline"
          onClick={() => onDelete(row)}
          type="button"
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
