const API_BASE_URL = "http://localhost:5002/api";

class ApiService {
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getListings(searchQuery = "") {
    const url = searchQuery
      ? `${API_BASE_URL}/listings?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/listings`;

    return await this.fetchWithErrorHandling(url);
  }

  async getListing(id) {
    return await this.fetchWithErrorHandling(`${API_BASE_URL}/listings/${id}`);
  }

  async createListing(listingData) {
    return await this.fetchWithErrorHandling(`${API_BASE_URL}/listings`, {
      method: "POST",
      body: JSON.stringify(listingData),
    });
  }

  async generateSummary(id) {
    return await this.fetchWithErrorHandling(
      `${API_BASE_URL}/listings/${id}/summary`,
      {
        method: "POST",
      }
    );
  }

  async healthCheck() {
    return await this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }
}

export default new ApiService();
