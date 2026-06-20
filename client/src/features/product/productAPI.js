import api from '@/api/axios'

export const fetchAllProducts = () => api.get('/products')
export const fetchProductById = (id) => api.get(`/products/${id}`)