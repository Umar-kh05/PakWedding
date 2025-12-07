import api from './api'

export interface Review {
    id?: string
    vendor_id: string
    booking_id?: string
    rating: number
    comment: string
    user_id?: string
    created_at?: string
}

export interface ReviewCreate {
    vendor_id: string
    booking_id?: string
    rating: number
    comment: string
}

export const reviewService = {
    // Create a new review
    async createReview(reviewData: ReviewCreate): Promise<Review> {
        const { data } = await api.post<Review>('/reviews/', reviewData)
        return data
    },

    // Get reviews for a specific vendor
    async getVendorReviews(vendorId: string): Promise<Review[]> {
        const { data } = await api.get<Review[]>(`/reviews/vendor/${vendorId}`)
        return data
    },

    // Get all reviews (admin only)
    async getAllReviews(): Promise<Review[]> {
        const { data } = await api.get<Review[]>('/admin/reviews')
        return data
    },

    // Delete a review (admin only)
    async deleteReview(reviewId: string): Promise<void> {
        await api.delete(`/admin/reviews/${reviewId}`)
    }
}

export default reviewService
