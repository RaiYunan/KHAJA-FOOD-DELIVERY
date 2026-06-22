import api from '@/api/axios'

export const placeOrderAPI = (data) => api.post('/orders/place', data)
export const fetchMyOrders = () => api.get('/orders/my-orders')
export const fetchMyOrder = (id) => api.get(`/orders/my-orders/${id}`)
export const cancelOrderAPI = (id, reason) =>
  api.patch(`/orders/my-orders/${id}/cancel`, { reason })
export const initiateKhaltiAPI = (orderId) =>
  api.post('/payment/khalti/initiate', { orderId })
export const verifyKhaltiAPI = (pidx) =>
  api.post('/payment/khalti/verify', { pidx })