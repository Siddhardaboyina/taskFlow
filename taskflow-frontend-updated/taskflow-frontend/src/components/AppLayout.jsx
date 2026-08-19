import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ username, activeFilter, onFilterChange, counts, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Navbar username={username} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <div className="app-body">
                <Sidebar
                    activeFilter={activeFilter}
                    onFilterChange={onFilterChange}
                    counts={counts}
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="app-main">{children}</main>
            </div>
        </div>
    );
}

export default AppLayout;
