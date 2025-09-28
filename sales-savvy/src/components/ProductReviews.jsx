import React, { useState, useEffect } from 'react';
// import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [ratingSummary, setRatingSummary] = useState({});
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        verifiedPurchase: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
        fetchRatingSummary();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/product/${productId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRatingSummary = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/summary/${productId}`);
            if (response.ok) {
                const data = await response.json();
                setRatingSummary(data);
            }
        } catch (error) {
            console.error('Error fetching rating summary:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
        
        if (!username) {
            alert('Please login to submit a review');
            return;
        }

        try {
            const reviewData = {
                username,
                productId,
                rating: newReview.rating,
                comment: newReview.comment,
                verifiedPurchase: newReview.verifiedPurchase
            };

            const response = await fetch('http://localhost:8080/api/reviews/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                setShowReviewForm(false);
                setNewReview({ rating: 5, comment: '', verifiedPurchase: true });
                fetchReviews();
                fetchRatingSummary();
                alert('Review submitted successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'star filled' : 'star'}>
                {i < rating ? '★' : '☆'}
            </span>
        ));
    };

    if (loading) {
        return <div className="reviews-loading">Loading reviews...</div>;
    }

    return (
        <div className="product-reviews">
            <div className="reviews-header">
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                    <div className="average-rating">
                        <span className="rating-number">{ratingSummary.averageRating || 0}</span>
                        <span className="rating-stars">
                            {renderStars(Math.round(ratingSummary.averageRating || 0))}
                        </span>
                        <span className="review-count">({ratingSummary.reviewCount || 0} reviews)</span>
                    </div>
                </div>
            </div>

            <button 
                className="add-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
            >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>

            {showReviewForm && (
                <form className="review-form" onSubmit={handleSubmitReview}>
                    <h4>Write Your Review</h4>
                    <div className="form-group">
                        <label>Rating:</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={star <= newReview.rating ? 'star filled' : 'star'}
                                    onClick={() => setNewReview({...newReview, rating: star})}
                                >
                                    {star <= newReview.rating ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Comment:</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            required
                            rows="4"
                        />
                    </div>
                    <button type="submit" className="submit-review-btn">Submit Review</button>
                </form>
            )}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <span className="reviewer-name">{review.username}</span>
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                    {review.verifiedPurchase && (
                                        <span className="verified-badge">✓ Verified Purchase</span>
                                    )}
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;