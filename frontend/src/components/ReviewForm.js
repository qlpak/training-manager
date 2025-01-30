import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const ReviewForm = ({ planId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reviews/${planId}`
        );
        const userReview = response.data.find((r) => r.user_id === userId);
        if (userReview) {
          setRating(userReview.rating);
          setComment(userReview.comment);
          setExistingReview(userReview);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [planId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let response;
      if (existingReview) {
        response = await axios.put(
          `http://localhost:3000/api/reviews/${existingReview.id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Review updated!");
      } else {
        response = await axios.post(
          "http://localhost:3000/api/reviews",
          { rating, comment, plan_id: planId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Review submitted!");
      }

      const updatedReview = response.data;

      if (updatedReview) {
        setExistingReview(updatedReview);
        setRating(updatedReview.rating);
        setComment(updatedReview.comment);
      }

      setIsEditing(false);
    } catch (error) {
      toast.error("Error submitting review.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:3000/api/reviews/${existingReview.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(0);
      setComment("");
      setExistingReview(null);
      setIsEditing(false);
      toast.success("Review deleted!");
    } catch (error) {
      toast.error("Error deleting review.");
    }
  };

  return (
    <div className="mt-2">
      <h5>Review Training</h5>
      {existingReview && !isEditing ? (
        <div className="border p-2 rounded">
          <p>
            <strong>Your Review:</strong>
          </p>
          <div className="mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="star"
                color={index < existingReview.rating ? "gold" : "gray"}
              />
            ))}
          </div>
          <p>{existingReview.comment}</p>
          <button className="btn btn-primary btn-sm me-2" onClick={handleEdit}>
            Edit Review
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete Review
          </button>
        </div>
      ) : isEditing ? (
        <>
          <div className="mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="star"
                color={index < rating ? "gold" : "gray"}
                onClick={() => setRating(index + 1)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
          <textarea
            className="form-control mb-2"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-success me-2" onClick={handleSubmit}>
            {existingReview ? "Update Review" : "Submit Review"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button className="btn btn-primary" onClick={handleEdit}>
          Add Review
        </button>
      )}
    </div>
  );
};

export default ReviewForm;
