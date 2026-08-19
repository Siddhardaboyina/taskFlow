import StatusBadge from "./StatusBadge";
import { STATUS_ORDER, statusLabel, isOverdue, formatDueDate } from "../utils/tasks";

function TaskCard({ task, onEdit, onDelete, onStatusChange, updatingStatus }) {
    const overdue = isOverdue(task);

    return (
        <div className={`task-card status-edge-${task.status?.toLowerCase()}`}>
            <div className="task-card-top">
                <h3 className="task-card-title">{task.title}</h3>
                <StatusBadge status={task.status} />
            </div>

            {task.description && <p className="task-card-description">{task.description}</p>}

            <div className="task-card-footer">
                <span className={`task-due ${overdue ? "task-due-overdue" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    {formatDueDate(task.dueDate)}
                    {overdue && <span className="task-due-label">Overdue</span>}
                </span>

                <div className="task-card-actions">
                    <div className="status-select-wrap">
                        <select
                            className="status-select"
                            value={task.status}
                            disabled={updatingStatus}
                            aria-label={`Change status for ${task.title}`}
                            onChange={(e) => onStatusChange(task.id, e.target.value)}
                        >
                            {STATUS_ORDER.map((s) => (
                                <option key={s} value={s}>
                                    {statusLabel(s)}
                                </option>
                            ))}
                        </select>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className="status-select-chevron"
                        >
                            <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
                        Edit
                    </button>
                    <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        onClick={() => onDelete(task)}
                        aria-label={`Delete ${task.title}`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
