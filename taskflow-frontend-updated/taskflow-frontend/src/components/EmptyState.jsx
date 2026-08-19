import Button from "./Button";

function EmptyState({
    title = "No tasks yet",
    description = "Create your first task and start organizing your work.",
    actionLabel = "Create task",
    onAction,
}) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M5 13l4 4L19 7"
                        stroke="var(--color-primary)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default EmptyState;
