const FILTERS = [
    { key: "all", label: "My tasks" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "overdue", label: "Overdue" },
];

function Sidebar({ activeFilter, onFilterChange, counts, open, onClose }) {
    return (
        <>
            {open && <div className="sidebar-scrim" onClick={onClose} aria-hidden="true" />}
            <nav className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Task filters">
                <ul className="sidebar-list">
                    {FILTERS.map((f) => (
                        <li key={f.key}>
                            <button
                                type="button"
                                className={`sidebar-item ${activeFilter === f.key ? "sidebar-item-active" : ""}`}
                                onClick={() => {
                                    onFilterChange(f.key);
                                    onClose();
                                }}
                                aria-current={activeFilter === f.key ? "page" : undefined}
                            >
                                <span>{f.label}</span>
                                <span className="sidebar-count">{counts[f.key] ?? 0}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default Sidebar;
