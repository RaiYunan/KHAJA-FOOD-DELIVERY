import express from 'express'
import {
  createReview,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviews,
  adminDeleteReview,
  toggleLikeReview,
  toggleDislikeReview,
  replyToReview,
  deleteReviewReply,
} from '../controllers/review.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = express.Router()

// public
router.get('/product/:productId', getProductReviews)
router.get('/:id', getReview)

// logged in user
router.post('/product/:productId', protect, createReview)
router.get('/user/my-reviews', protect, getMyReviews)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)
router.put('/:id/like', protect, toggleLikeReview)
router.put('/:id/dislike', protect, toggleDislikeReview)

// admin
router.get('/', protect, authorize('admin'), getAllReviews)
router.delete('/admin/:id', protect, authorize('admin'), adminDeleteReview)
export const toggleLike = (id) => api.put(`/reviews/${id}/like`)
export const toggleDislike = (id) => api.put(`/reviews/${id}/dislike`)
export const replyToReviewAPI = (id, comment) => api.put(`/reviews/${id}/reply`, { comment })
export const deleteReplyAPI = (id) => api.delete(`/reviews/${id}/reply`)

export default router