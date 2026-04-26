import api from "./api";

const hotelService = {
  /**
   * Search hotels at a destination.
   * @param {object} params - { destination, checkIn, checkOut, guests, minPrice, maxPrice, rating }
   */
  search: async (params) => {
    const res = await api.get("/hotels/search", { params });
    return res.data;
  },

  /**
   * Get hotel details by ID.
   */
  getHotel: async (hotelId) => {
    const res = await api.get(`/hotels/${hotelId}`);
    return res.data;
  },

  /**
   * Get available rooms for a hotel.
   */
  getRooms: async (hotelId, params) => {
    const res = await api.get(`/hotels/${hotelId}/rooms`, { params });
    return res.data;
  },

  /**
   * Get local transport options from arrival point to hotel.
   */
  getLocalTransport: async (hotelId, arrivalPoint) => {
    const res = await api.get(`/hotels/${hotelId}/local-transport`, {
      params: { arrivalPoint },
    });
    return res.data;
  },
};

export default hotelService;