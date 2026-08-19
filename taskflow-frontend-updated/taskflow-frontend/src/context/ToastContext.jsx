import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const showToast = useCallback(
        (message, tone = "success", duration = 3500) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, message, tone }]);
            timers.current[id] = setTimeout(() => dismiss(id), duration);
            return id;
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={{ showToast, dismiss }}>
            {children}
            <div className="toast-stack" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast-${t.tone}`}>
                        <span className="toast-icon" aria-hidden="true">
                            {t.tone === "error" ? "✕" : "✓"}
                        </span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Exports both the provider component and its hook (standard context
// pattern); react-refresh's "only export components" check doesn't apply
// well to context modules like this one.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
