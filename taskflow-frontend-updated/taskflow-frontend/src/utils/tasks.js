// Shared helpers for working with task data returned by the backend.
// Backend status values are exactly: TODO | IN_PROGRESS | COMPLETED

export const STATUS_LABELS = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    COMPLETED: "Done",
};

export const STATUS_ORDER = ["TODO", "IN_PROGRESS", "COMPLETED"];

export function statusLabel(status) {
    return STATUS_LABELS[status] || status;
}

export function isOverdue(task) {
    if (!task.dueDate || task.status === "COMPLETED") return false;

    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
}

export function formatDueDate(dueDate) {
    if (!dueDate) return "No due date";

    const date = new Date(dueDate);
    if (Number.isNaN(date.getTime())) return dueDate;

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function computeStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const active = total - completed;
    const overdue = tasks.filter(isOverdue).length;

    return { total, active, completed, overdue };
}
