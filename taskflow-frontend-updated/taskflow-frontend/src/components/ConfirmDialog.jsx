import { useEffect, useRef } from "react";
import Button from "./Button";

function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    danger = true,
    loading = false,
    onConfirm,
    onCancel,
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        function handleKey(e) {
            if (e.key === "Escape" && !loading) onCancel();
        }

        document.addEventListener("keydown", handleKey);
        dialogRef.current?.focus();

        return () => document.removeEventListener("keydown", handleKey);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div className="overlay" role="presentation" onMouseDown={() => !loading && onCancel()}>
            <div
                className="dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-desc"
                tabIndex={-1}
                ref={dialogRef}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h2 id="confirm-dialog-title" className="dialog-title">
                    {title}
                </h2>
                <p id="confirm-dialog-desc" className="dialog-description">
                    {description}
                </p>
                <div className="dialog-actions">
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
