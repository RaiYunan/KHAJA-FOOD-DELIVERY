import api from '@/api/axios'

export const fetchCart = () => api.get('/cart')
export const addItemToCart = (productId, quantity) =>
  api.post('/cart/add', { productId, quantity })
export const updateItemQuantity = (productId, quantity) =>
  api.put(`/cart/item/${productId}`, { quantity })
export const removeItemFromCart = (productId) =>
  api.delete(`/cart/item/${productId}`)
export const clearCart = () => api.delete('/cart/clear')