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

// admin
router.get('/', protect, authorize('admin'), getAllReviews)
router.delete('/admin/:id', protect, authorize('admin'), adminDeleteReview)

export default router