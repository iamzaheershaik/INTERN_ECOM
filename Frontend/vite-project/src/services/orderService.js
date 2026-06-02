import api from './api';

const orderService = {
  createOrder: async () => {
    const response = await api.post('/orders');
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;
