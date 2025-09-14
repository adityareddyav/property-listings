import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getListing(id);
      setListing(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('not found')) {
        // Automatically redirect to home after 3 seconds for 404
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);
      const summaryData = await apiService.generateSummary(id);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      // For demo purposes, show a fallback summary
      setSummary({
        listing_id: id,
        summary: [
          "Unable to generate AI summary at this time",
          "Please check the listing details below",
          "Contact support if this issue persists"
        ],
        generated_at: new Date().toISOString()
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Property Not Found</h3>
          <p>{error}</p>
          <p>Redirecting to homepage...</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container">
        <div className="error">
          <h3>No listing data available</h3>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{listing.title}</span>
      </div>

      <div className="listing-detail">
        <div className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-price-large">
            {formatPrice(listing.price)}
          </div>
        </div>

        <div className="listing-info">
          <div className="listing-location-large">
            📍 {listing.location}
          </div>
          <div className="listing-date-large">
            Listed on {formatDate(listing.created_at)}
          </div>
        </div>

        <div className="listing-description-section">
          <h2>Description</h2>
          <p className="listing-description-full">
            {listing.description}
          </p>
        </div>

        <div className="listing-actions">
          <button 
            onClick={generateSummary}
            disabled={summaryLoading}
            className="btn btn-secondary"
          >
            {summaryLoading ? 'Generating...' : '🤖 Generate AI Summary'}
          </button>
          
          <Link to="/" className="btn btn-outline">
            ← Back to Listings
          </Link>
        </div>

        {summary && (
          <div className="ai-summary">
            <h2>AI-Generated Summary</h2>
            <div className="summary-content">
              <ul className="summary-list">
                {summary.summary.map((point, index) => (
                  <li key={index} className="summary-point">
                    {point}
                  </li>
                ))}
              </ul>
              <div className="summary-meta">
                <small>
                  Generated on {formatDate(summary.generated_at)}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;