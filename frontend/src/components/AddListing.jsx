import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../services/api";

const AddListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be a positive number";
      } else if (price > 10000000) {
        newErrors.price = "Price seems unreasonably high";
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Location must be at least 3 characters long";
    } else if (formData.location.trim().length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError(null);

      const newListing = await apiService.createListing({
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        location: formData.location.trim(),
        description: formData.description.trim(),
      });

      // Redirect to the newly created listing
      navigate(`/listing/${newListing.id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      price: "",
      location: "",
      description: "",
    });
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Add New Listing</span>
      </div>

      <div className="add-listing-form">
        <div className="form-header">
          <h1>Add New Property Listing</h1>
          <p>Fill out the form below to list your property</p>
        </div>

        {submitError && (
          <div className="error-banner">
            <strong>Error:</strong> {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Property Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? "error" : ""}`}
              placeholder="e.g., Modern 3-Bedroom House with Garden"
              maxLength="100"
              disabled={loading}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
            <small className="form-hint">
              {formData.title.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-input ${errors.price ? "error" : ""}`}
              placeholder="e.g., 450000"
              min="1"
              step="1000"
              disabled={loading}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
            <small className="form-hint">Enter the listing price in USD</small>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-input ${errors.location ? "error" : ""}`}
              placeholder="e.g., Downtown Seattle, WA"
              maxLength="100"
              disabled={loading}
            />
            {errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
            <small className="form-hint">
              {formData.location.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? "error" : ""}`}
              placeholder="Describe the property features, amenities, neighborhood, and what makes it special..."
              rows="6"
              maxLength="1000"
              disabled={loading}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
            <small className="form-hint">
              {formData.description.length}/1000 characters
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="btn btn-secondary"
            >
              Reset Form
            </button>

            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
