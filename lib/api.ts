import axios from "axios";
import { logout } from "./auth";

export const BASE_URL = "http://localhost:8080";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401 ) {
//       logout(); // clears token and redirects to /login
//     }
//     const message = err.response?.data?.message || err.message;
//     return Promise.reject(new Error(message));
//   }
// );

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 ||err.response?.status === 403) {
      logout(); // clears token and redirects to /login
    }
    const message = err.response?.data?.message || err.message;
    return Promise.reject(new Error(message));
  }
);

// AUTH
export const loginUser = (data: any) => api.post("/api/auth/login", data).then(res => res.data);
export const registerUser = (data: any) => api.post("/api/auth/register", data).then(res => res.data);

export const chatStream = async (q: string, userId: string, onChunk: (chunk: string) => void) => {
  const res = await fetch(
    `http://localhost:8080/api/chat/stream?q=${encodeURIComponent(q)}`,
    {
      method: "GET",
      headers: { userId },
      credentials: "include",
    }
  );

  if (!res.body) throw new Error("Stream not available");

  // Already working chunks
  const reader = res.body.getReader?.();
  if (!reader) {
    // fallback: read text normally
    const text = await res.text();
    onChunk(text);
    return;
  }

  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      onChunk(decoder.decode(value));
    }
  }
};


// TICKETS
export const listTickets = () => api.get("/api/tickets").then(res => res.data);

export const listTicketsByUser = (email: string) => api.get(`/api/tickets/${email}`).then(res => res.data);

export const createTicket = (data: any) => api.post("/api/tickets/create", data).then(res => res.data);

export const updateTicketStatus = (id: number, status: string) =>
  api.put(`/api/tickets/${id}/status`, null, { params: { s: status } }).then(res => res.data);

export const assignTicket = (id: number, assignee: string) =>
  api.put(`/api/tickets/${id}/assign`, null, { params: { assignee } }).then(res => res.data);

export const deleteTicket = (id: number) => api.delete(`/api/tickets/${id}`).then(res => res.data);

// DOCUMENTS
export const uploadDocument = async (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post("/api/documents/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const listDocuments = () => api.get("/api/documents/list").then(res => res.data);

export const deleteDocument = (id: string) => api.delete(`/api/documents/${id}`).then(res => res.data);

// USERS / AGENTS
export const listUsers = () => api.get("/api/auth/users").then(res => res.data);

export const deleteUser = (id: string) =>
  api.delete(`/api/auth/users/${id}`).then(res => res.data);

export const updateUser = (id: string, data: any) =>
  api.put(`/api/auth/users/${id}`, data).then(res => res.data);

export const createAgent = (data: any) =>
  api.post("/api/auth/register", data).then(res => res.data);

export async function getChatHistory(userId: string) {
  const res = await api.get(`/api/chat/conversation`, { 
    headers:{
      "userId": userId 
    }
  });

  if (res.status !== 200) {
    throw new Error("Failed to load chat history");
  }

  const data = await res.data;

  // Convert backend format to frontend format
  return data.map((msg: any) => ({
    role: msg.messageType.toLowerCase() === "assistant" ? "assistant" : "user",
    content: msg.text
  }));
}
