import Review from '../models/review.model.js'
import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Create review
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const productId = req.params.productId

  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  })
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product')
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  })

  await review.populate('user', 'name avatar')

  res.status(201).json({ success: true, review })
})

// Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    averageRating: product.averageRating,
    totalReviews: product.totalReviews,
    reviews,
  })
})

// Get single review
export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('product', 'name image price')

  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  res.status(200).json({ success: true, review })
})

//  Update own review
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own review')
  }

  if (rating && (rating < 1 || rating > 5)) {
    throw new ApiError(400, 'Rating must be between 1 and 5')
  }

  review.rating = rating ?? review.rating
  review.comment = comment ?? review.comment
  await review.save()

  await review.populate('user', 'name avatar')

  res.status(200).json({ success: true, review })
})

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  const isOwner = review.user.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You can only delete your own review')
  }

  await review.deleteOne()

  res.status(200).json({ success: true, message: 'Review deleted' })
})

// Toggle like on a review
export const toggleLikeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  const userId = req.user._id.toString()
  const hasLiked = review.likes.some((id) => id.toString() === userId)

  if (hasLiked) {
    review.likes = review.likes.filter((id) => id.toString() !== userId)
  } else {
    review.likes.push(req.user._id)
    review.dislikes = review.dislikes.filter((id) => id.toString() !== userId)
  }

  await review.save()

  res.status(200).json({
    success: true,
    likes: review.likes,
    dislikes: review.dislikes,
  })
})

// Toggle dislike on a review
export const toggleDislikeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  const userId = req.user._id.toString()
  const hasDisliked = review.dislikes.some((id) => id.toString() === userId)

  if (hasDisliked) {
    review.dislikes = review.dislikes.filter((id) => id.toString() !== userId)
  } else {
    review.dislikes.push(req.user._id)
    review.likes = review.likes.filter((id) => id.toString() !== userId)
  }

  await review.save()

  res.status(200).json({
    success: true,
    likes: review.likes,
    dislikes: review.dislikes,
  })
})

// Admin — add or update reply on a review
export const replyToReview = asyncHandler(async (req, res) => {
  const { comment } = req.body
  if (!comment) {
    throw new ApiError(400, 'Reply comment is required')
  }

  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  review.adminReply = { comment, repliedAt: new Date() }
  await review.save()

  res.status(200).json({ success: true, review })
})

// Admin — remove reply from a review
export const deleteReviewReply = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name avatar')
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  review.adminReply = undefined
  await review.save()

  res.status(200).json({ success: true, review })
})

// Get my reviews
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name image price')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  })
})

// Admin — get all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name price')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  })
})

// Admin — delete any review
export const adminDeleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  await review.deleteOne()

  res.status(200).json({ success: true, message: 'Review deleted by admin' })
})