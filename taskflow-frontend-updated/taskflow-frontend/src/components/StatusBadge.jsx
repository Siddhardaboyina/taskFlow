import { statusLabel } from "../utils/tasks";

function StatusBadge({ status }) {
    const cls = status ? status.toLowerCase() : "todo";

    return (
        <span className={`status-badge status-badge-${cls}`}>
            <span className="status-dot" aria-hidden="true" />
            {statusLabel(status)}
        </span>
    );
}

export default StatusBadge;
