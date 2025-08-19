// client/src/apiConfig.js

// This file centralizes the backend URL.
// 1. It first tries to read the VITE_API_URL from the deployment environment variables (Vercel).
// 2. If it's not found (meaning we are running on our local machine), it defaults to localhost:5000.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';