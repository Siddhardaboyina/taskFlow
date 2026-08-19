import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import InlineBanner from "../components/InlineBanner";
import { useToast } from "../context/ToastContext";
import {
    getTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getStoredUsername,
    UnauthorizedError,
} from "../services/api";
import { computeStats, isOverdue } from "../utils/tasks";

function Dashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const username = getStoredUsername();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [filter, setFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [statusUpdatingId, setStatusUpdatingId] = useState(null);

    const handleAuthError = useCallback(() => {
        navigate("/login", { replace: true });
    }, [navigate]);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                handleAuthError();
                return;
            }
            setLoadError(error.message || "Unable to load tasks");
        } finally {
            setLoading(false);
        }
    }, [handleAuthError]);

    useEffect(() => {
        // Fetch-on-mount: legitimate use of an effect (see loadTasks, which
        // itself only sets state after the awaited network response resolves).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTasks();
    }, [loadTasks]);

    const stats = useMemo(() => computeStats(tasks), [tasks]);

    const counts = useMemo(
        () => ({
            all: tasks.length,
            active: stats.active,
            completed: stats.completed,
            overdue: stats.overdue,
        }),
        [tasks.length, stats]
    );

    const filteredTasks = useMemo(() => {
        switch (filter) {
            case "active":
                return tasks.filter((t) => t.status !== "COMPLETED");
            case "completed":
                return tasks.filter((t) => t.status === "COMPLETED");
            case "overdue":
                return tasks.filter(isOverdue);
            default:
                return tasks;
        }
    }, [tasks, filter]);

    const openCreateModal = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleModalSubmit = async (formValues) => {
        try {
            if (editingTask) {
                const updated = await updateTask(editingTask.id, formValues);
                setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                showToast("Task updated", "success");
            } else {
                const created = await createTask(formValues);
                setTasks((prev) => [...prev, created]);
                showToast("Task created successfully", "success");
            }
            setModalOpen(false);
            setEditingTask(null);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                handleAuthError();
                return;
            }
            throw error;
        }
    };

    const handleStatusChange = async (taskId, status) => {
        setStatusUpdatingId(taskId);
        try {
            const updated = await updateTaskStatus(taskId, status);
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            showToast(status === "COMPLETED" ? "Task completed" : "Task status updated", "success");
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                handleAuthError();
                return;
            }
            showToast(error.message || "Something went wrong", "error");
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const requestDelete = (task) => setDeleteTarget(task);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteTask(deleteTarget.id);
            setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
            showToast("Task deleted", "success");
            setDeleteTarget(null);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                handleAuthError();
                return;
            }
            showToast(error.message || "Something went wrong", "error");
        } finally {
            setDeleting(false);
        }
    };

    const filterTitle = {
        all: "My tasks",
        active: "Active tasks",
        completed: "Completed tasks",
        overdue: "Overdue tasks",
    }[filter];

    return (
        <AppLayout username={username} activeFilter={filter} onFilterChange={setFilter} counts={counts}>
            <div className="dashboard-greeting">
                <h1>{username ? `Good to see you, ${username}` : "Good to see you"}</h1>
                <p>Here&apos;s what&apos;s happening with your tasks.</p>
            </div>

            <div className="stats-grid">
                <StatCard label="Total tasks" value={stats.total} />
                <StatCard label="Active" value={stats.active} tone="active" />
                <StatCard label="Completed" value={stats.completed} tone="success" />
                <StatCard label="Overdue" value={stats.overdue} tone="danger" />
            </div>

            <div className="section-header">
                <h2>{filterTitle}</h2>
                <Button variant="primary" onClick={openCreateModal}>
                    + New task
                </Button>
            </div>

            <InlineBanner tone="error">{loadError}</InlineBanner>

            {loading ? (
                <LoadingSpinner label="Loading tasks…" />
            ) : filteredTasks.length === 0 ? (
                tasks.length === 0 ? (
                    <EmptyState onAction={openCreateModal} />
                ) : (
                    <EmptyState
                        title="Nothing here"
                        description="No tasks match this view right now."
                    />
                )
            ) : (
                <div className="task-list">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={openEditModal}
                            onDelete={requestDelete}
                            onStatusChange={handleStatusChange}
                            updatingStatus={statusUpdatingId === task.id}
                        />
                    ))}
                </div>
            )}

            <TaskModal
                open={modalOpen}
                task={editingTask}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleModalSubmit}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Delete task?"
                description={
                    deleteTarget ? `Are you sure you want to delete "${deleteTarget.title}"? This can't be undone.` : ""
                }
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </AppLayout>
    );
}

export default Dashboard;
