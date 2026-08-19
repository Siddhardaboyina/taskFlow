import { useEffect, useRef, useState } from "react";
import TextField from "./TextField";
import Button from "./Button";
import InlineBanner from "./InlineBanner";

const EMPTY_FORM = { title: "", description: "", dueDate: "" };

function TaskModal({ open, task, onClose, onSubmit }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const panelRef = useRef(null);

    const isEditing = Boolean(task);

    useEffect(() => {
        if (open) {
            // Sync form fields to the task prop whenever the modal opens —
            // a standard "reset on open" controlled-form pattern.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm(
                task
                    ? { title: task.title || "", description: task.description || "", dueDate: task.dueDate || "" }
                    : EMPTY_FORM
            );
            setFieldErrors({});
            setFormError("");
            panelRef.current?.focus();
        }
    }, [open, task]);

    useEffect(() => {
        if (!open) return;
        function handleKey(e) {
            if (e.key === "Escape" && !loading) onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, loading]);

    if (!open) return null;

    const validate = () => {
        const errors = {};
        if (!form.title.trim()) errors.title = "Give the task a title";
        if (!form.dueDate) errors.dueDate = "Pick a due date";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || loading) return;

        setLoading(true);
        try {
            await onSubmit({
                title: form.title.trim(),
                description: form.description.trim(),
                dueDate: form.dueDate,
            });
        } catch (error) {
            setFormError(error.message || (isEditing ? "Unable to update task" : "Unable to create task"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay" role="presentation" onMouseDown={() => !loading && onClose()}>
            <div
                className="modal-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                tabIndex={-1}
                ref={panelRef}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 id="task-modal-title" className="dialog-title">
                        {isEditing ? "Edit task" : "Create new task"}
                    </h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <InlineBanner tone="error">{formError}</InlineBanner>

                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="task-title"
                        label="Title"
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        error={fieldErrors.title}
                        disabled={loading}
                        autoFocus
                    />

                    <TextField
                        id="task-description"
                        label="Description"
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        disabled={loading}
                    />

                    <TextField
                        id="task-due-date"
                        label="Due date"
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                        error={fieldErrors.dueDate}
                        disabled={loading}
                    />

                    <div className="dialog-actions">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            {isEditing ? "Save changes" : "Create task"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
