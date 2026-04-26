import api from "./api";

const authService = {
  /**
   * Register a new user.
   */
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  /**
   * Login with email and password.
   */
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; // { user, token }
  },

  /**
   * Logout (server-side token invalidation if needed).
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // Ignore server errors on logout
    }
  },

  /**
   * Get the current logged-in user profile.
   */
  getProfile: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  /**
   * Update user profile.
   */
  updateProfile: async (data) => {
    const res = await api.put("/auth/me", data);
    return res.data;
  },

  /**
   * Change password.
   */
  changePassword: async (oldPassword, newPassword) => {
    const res = await api.put("/auth/change-password", { oldPassword, newPassword });
    return res.data;
  },
};

export default authService;