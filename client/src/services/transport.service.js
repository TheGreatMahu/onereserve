import api from "./api";

const transportService = {
  /**
   * Search available transport options.
   * @param {object} params - { type, origin, destination, date, passengers }
   */
  search: async (params) => {
    const res = await api.get("/transport/search", { params });
    return res.data;
  },

  /**
   * Get details for a specific schedule.
   */
  getSchedule: async (scheduleId) => {
    const res = await api.get(`/transport/schedule/${scheduleId}`);
    return res.data;
  },

  /**
   * Get available seats for a schedule.
   */
  getSeats: async (scheduleId) => {
    const res = await api.get(`/transport/schedule/${scheduleId}/seats`);
    return res.data;
  },

  /**
   * Lock a seat temporarily (5 minutes).
   */
  lockSeat: async (scheduleId, seatNumber) => {
    const res = await api.post(`/transport/schedule/${scheduleId}/lock-seat`, { seatNumber });
    return res.data;
  },

  /**
   * Release a seat lock.
   */
  releaseSeat: async (scheduleId, seatNumber) => {
    const res = await api.post(`/transport/schedule/${scheduleId}/release-seat`, { seatNumber });
    return res.data;
  },

  /**
   * Get route information between two points.
   */
  getRoute: async (origin, destination, type) => {
    const res = await api.get("/transport/route", { params: { origin, destination, type } });
    return res.data;
  },

  /**
   * Get available operators for a type.
   */
  getOperators: async (type) => {
    const res = await api.get(`/transport/operators`, { params: { type } });
    return res.data;
  },
};

export default transportService;