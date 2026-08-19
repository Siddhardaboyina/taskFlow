// Centralized API service for TaskFlow.
//
// IMPORTANT: /api/auth/login and /api/auth/register respond with a plain
// text body (not JSON) on this backend — the login response body IS the
// raw JWT string. That contract is preserved exactly as the existing
// (working) implementation used it; do not change to response.json()
// without checking the Spring Boot controller first.

const BASE_URL = "https://taskflow-backend-u36r.onrender.com";

export class UnauthorizedError extends Error {
    constructor(message = "Session expired") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
}

export function isAuthenticated() {
    return Boolean(getToken());
}

export function getStoredUsername() {
    return localStorage.getItem("username") || "";
}

function setStoredUsername(username) {
    localStorage.setItem("username", username);
}

function clearStoredUsername() {
    localStorage.removeItem("username");
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Wraps fetch for authenticated JSON task endpoints.
 * On 401/403 it clears the stored token and throws UnauthorizedError so
 * callers (route guards / pages) can redirect to /login.
 */
async function authedFetch(path, options = {}) {
    let response;

    try {
        response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                ...authHeaders(),
                ...(options.headers || {}),
            },
        });
    } catch {
        throw new Error("Could not connect to server");
    }

    if (response.status === 401 || response.status === 403) {
        clearToken();
        clearStoredUsername();
        throw new UnauthorizedError();
    }

    return response;
}

// ---- Auth ----------------------------------------------------------------

export async function login(username, password) {
    let response;

    try {
        response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    } catch {
        throw new Error("Could not connect to server");
    }

    const data = await response.text();

    if (!response.ok) {
        throw new Error(data || "Invalid username or password");
    }

    setToken(data);
    setStoredUsername(username);
    return data;
}

export async function register(username, email, password) {
    let response;

    try {
        response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
    } catch {
        throw new Error("Could not connect to server");
    }

    const data = await response.text();

    if (!response.ok) {
        throw new Error(data || "Registration failed");
    }

    return data;
}

export function logout() {
    clearToken();
    clearStoredUsername();
}

// ---- Tasks -----------------------------------------------------------------

export async function getTasks() {
    const response = await authedFetch("/api/tasks", { method: "GET" });

    if (!response.ok) {
        throw new Error("Unable to load tasks");
    }

    return response.json();
}

export async function createTask({ title, description, dueDate }) {
    const response = await authedFetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
    });

    if (!response.ok) {
        throw new Error("Unable to create task");
    }

    return response.json();
}

export async function updateTask(id, { title, description, dueDate }) {
    const response = await authedFetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
    });

    if (!response.ok) {
        throw new Error("Unable to update task");
    }

    return response.json();
}

export async function updateTaskStatus(id, status) {
    const response = await authedFetch(
        `/api/tasks/${id}/status?status=${encodeURIComponent(status)}`,
        { method: "PATCH" }
    );

    if (!response.ok) {
        throw new Error("Unable to update task");
    }

    return response.json();
}

export async function deleteTask(id) {
    const response = await authedFetch(`/api/tasks/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Unable to delete task");
    }

    return true;
}
