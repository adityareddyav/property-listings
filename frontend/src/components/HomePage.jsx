import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import apiService from "../services/api";

const HomePage = () => {
  console.log("HomePage component is rendering!");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getListings(query);
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchListings(query);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error loading properties</h3>
          <p>{error}</p>
          <button
            onClick={() => fetchListings(searchQuery)}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Property Listings</h1>
        <p>Find your dream property</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="listings-stats">
        <p>{listings ? listings.length : 0} properties found</p>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="no-results">
          <h3>No properties found</h3>
          <p>
            {searchQuery
              ? `No properties match "${searchQuery}". Try a different search term.`
              : "No properties available at the moment."}
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="btn btn-secondary"
            >
              Show All Properties
            </button>
          )}
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="listing-card"
            >
              <div className="listing-card-content">
                <div className="listing-price">
                  {formatPrice(listing.price)}
                </div>
                <h3 className="listing-title">{listing.title}</h3>
                <p className="listing-location">📍 {listing.location}</p>
                <p className="listing-description">
                  {listing.description.length > 120
                    ? `${listing.description.substring(0, 120)}...`
                    : listing.description}
                </p>
                <div className="listing-meta">
                  <span className="listing-date">
                    Listed {formatDate(listing.created_at)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
