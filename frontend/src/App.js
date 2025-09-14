import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import ListingDetail from "./components/ListingDetail";
import AddListing from "./components/AddListing";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🏠 Property Listings
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/add" className="nav-link">
                Add Listing
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/add" element={<AddListing />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Property Listings. Built with React & Flask.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
