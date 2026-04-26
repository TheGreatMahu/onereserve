import api from "./api";

const bookingService = {
  /**
   * Create a transport booking.
   */
  createTransportBooking: async (data) => {
    const res = await api.post("/bookings/transport", data);
    return res.data;
  },

  /**
   * Create a hotel booking.
   */
  createHotelBooking: async (data) => {
    const res = await api.post("/bookings/hotel", data);
    return res.data;
  },

  /**
   * Get all bookings for the logged-in user.
   */
  getMyBookings: async (params = {}) => {
    const res = await api.get("/bookings/my", { params });
    return res.data;
  },

  /**
   * Get a specific booking by ID.
   */
  getBooking: async (bookingId) => {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data;
  },

  /**
   * Cancel a booking.
   */
  cancelBooking: async (bookingId, reason = "") => {
    const res = await api.patch(`/bookings/${bookingId}/cancel`, { reason });
    return res.data;
  },

  /**
   * Modify a transport booking.
   */
  modifyTransportBooking: async (bookingId, data) => {
    const res = await api.patch(`/bookings/transport/${bookingId}`, data);
    return res.data;
  },

  /**
   * Modify a hotel booking.
   */
  modifyHotelBooking: async (bookingId, data) => {
    const res = await api.patch(`/bookings/hotel/${bookingId}`, data);
    return res.data;
  },

  /**
   * Download ticket/invoice as PDF.
   */
  downloadTicket: async (bookingId) => {
    const res = await api.get(`/bookings/${bookingId}/ticket`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ticket-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Process payment for a booking.
   */
  processPayment: async (bookingId, paymentData) => {
    const res = await api.post(`/bookings/${bookingId}/pay`, paymentData);
    return res.data;
  },
};

export default bookingService;