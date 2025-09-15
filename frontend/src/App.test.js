import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { act } from "react"; // Added to handle act deprecation
import App from "./App";
import HomePage from "./components/HomePage";
import SearchBar from "./components/SearchBar";
import AddListing from "./components/AddListing";

// Mock the API service
jest.mock("./services/api", () => ({
  getListings: jest.fn(),
  createListing: jest.fn(),
  getListing: jest.fn(),
  generateSummary: jest.fn(),
  healthCheck: jest.fn(),
}));

// Mock react-router-dom for components that use navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "test-id-123" }),
}));

import apiService from "./services/api";

// Test wrapper component for Router context
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("App Component", () => {
  test("renders navigation and main content", async () => {
    await act(async () => {
      render(<App />);
    });

    // Check if navigation elements are present
    expect(screen.getByText("🏠 Property Listings")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Add Listing")).toBeInTheDocument();

    // Check footer
    expect(screen.getByText(/© 2025 Property Listings/)).toBeInTheDocument();
  });
});

describe("HomePage Component - Happy Path", () => {
  const mockListings = [
    {
      id: "1",
      title: "Modern Downtown Apartment",
      price: 350000,
      location: "Downtown Seattle, WA",
      description: "Beautiful 2-bedroom apartment with city views",
      created_at: "2025-01-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Cozy Suburban House",
      price: 480000,
      location: "Bellevue, WA",
      description: "Charming 3-bedroom house with large backyard",
      created_at: "2025-01-14T15:45:00Z",
    },
  ];

  beforeEach(() => {
    apiService.getListings.mockClear();
    // Ensure mock returns a promise to simulate async behavior
    apiService.getListings.mockReturnValue(Promise.resolve(mockListings));
  });

  test("displays listings successfully", async () => {
    // Make sure mock returns data immediately
    apiService.getListings.mockResolvedValue(mockListings);

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Wait for listings to load (don't check loading state)
    await waitFor(
      () => {
        expect(
          screen.getByText("Modern Downtown Apartment")
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Rest of test...
  });

  test("search functionality works", async () => {
    const filteredListings = [mockListings[0]]; // Only apartment

    apiService.getListings
      .mockResolvedValueOnce(mockListings) // Initial load
      .mockResolvedValueOnce(filteredListings); // Search results

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Modern Downtown Apartment")).toBeInTheDocument();
    });

    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText(/Search properties/);
    const searchButton = screen.getByText("🔍 Search");

    fireEvent.change(searchInput, { target: { value: "apartment" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("1 properties found")).toBeInTheDocument();
    });

    expect(apiService.getListings).toHaveBeenCalledWith("apartment");
  });
});

describe("HomePage Component - Edge Cases", () => {
  beforeEach(() => {
    apiService.getListings.mockClear();
  });

  test("handles API error gracefully", async () => {
    apiService.getListings.mockRejectedValue(new Error("Network error"));

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading properties")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    // Check retry button exists
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  test("displays no results message when search returns empty", async () => {
    apiService.getListings
      .mockResolvedValueOnce([]) // Initial empty load
      .mockResolvedValueOnce([]); // Empty search results

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("No properties found")).toBeInTheDocument();
    });

    // Test search with no results
    const searchInput = screen.getByPlaceholderText(/Search properties/);
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    fireEvent.click(screen.getByText("🔍 Search"));

    await waitFor(() => {
      expect(
        screen.getByText(/No properties match "nonexistent"/)
      ).toBeInTheDocument();
    });
  });
});

describe("SearchBar Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test("calls onSearch when form is submitted", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(/Search properties/);
    const searchButton = screen.getByText("🔍 Search");

    fireEvent.change(searchInput, { target: { value: "test query" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });

  test("trims whitespace from search query", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(/Search properties/);
    fireEvent.change(searchInput, { target: { value: "  test query  " } });
    fireEvent.submit(searchInput.closest("form"));

    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });

  test("clear button works correctly", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(/Search properties/);

    // Type something to show clear button
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Clear button should appear
    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});

describe("AddListing Component - Happy Path", () => {
  beforeEach(() => {
    apiService.createListing.mockClear();
    mockNavigate.mockClear();
  });

  test("submits form with valid data", async () => {
    const newListing = {
      id: "new-listing-id",
      title: "Test Property",
      price: 300000,
      location: "Test Location",
      description:
        "This is a test property description with enough characters.",
    };

    apiService.createListing.mockResolvedValue(newListing);

    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Property Title/), {
      target: { value: "Test Property" },
    });
    fireEvent.change(screen.getByLabelText(/Price/), {
      target: { value: "300000" },
    });
    fireEvent.change(screen.getByLabelText(/Location/), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: {
        value: "This is a test property description with enough characters.",
      },
    });

    // Wrap submission in act
    await act(async () => {
      fireEvent.click(screen.getByText("Create Listing"));
    });

    await waitFor(() => {
      expect(apiService.createListing).toHaveBeenCalledWith({
        title: "Test Property",
        price: 300000,
        location: "Test Location",
        description:
          "This is a test property description with enough characters.",
      });
    });

    // Check if navigation is called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/listing/new-listing-id");
    });
  });
});

describe("AddListing Component - Edge Cases", () => {
  beforeEach(() => {
    apiService.createListing.mockClear();
  });

  test("shows validation errors for empty required fields", async () => {
    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    // Try to submit empty form
    await act(async () => {
      fireEvent.click(screen.getByText("Create Listing"));
    });

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
      expect(screen.getByText("Location is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });

    // API should not be called
    expect(apiService.createListing).not.toHaveBeenCalled();
  });

  test("validates minimum field lengths", async () => {
    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    // Fill with too-short values
    fireEvent.change(screen.getByLabelText(/Property Title/), {
      target: { value: "123" }, // Too short
    });
    fireEvent.change(screen.getByLabelText(/Price/), {
      target: { value: "100000" },
    });
    fireEvent.change(screen.getByLabelText(/Location/), {
      target: { value: "NY" }, // Too short
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { value: "Too short" }, // Less than 20 characters
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Create Listing"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Title must be at least 5 characters long")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Location must be at least 3 characters long")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Description must be at least 20 characters long")
      ).toBeInTheDocument();
    });
  });

  test("validates price field correctly", async () => {
    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    const priceInput = screen.getByLabelText(/Price/);

    // Test negative price
    fireEvent.change(priceInput, { target: { value: "-1000" } });
    await act(async () => {
      fireEvent.click(screen.getByText("Create Listing"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Price must be a positive number")
      ).toBeInTheDocument();
    });
  });

  test("handles API error during submission", async () => {
    apiService.createListing.mockRejectedValue(new Error("Server error"));

    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    // Fill out valid form
    fireEvent.change(screen.getByLabelText(/Property Title/), {
      target: { value: "Valid Title" },
    });
    fireEvent.change(screen.getByLabelText(/Price/), {
      target: { value: "300000" },
    });
    fireEvent.change(screen.getByLabelText(/Location/), {
      target: { value: "Valid Location" },
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: {
        value:
          "This is a valid description with enough characters to meet requirements.",
      },
    });

    // Wrap submission in act
    await act(async () => {
      fireEvent.click(screen.getByText("Create Listing"));
    });

    await waitFor(() => {
      // Use getByText within the error-banner to avoid multiple matches
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  test("reset form functionality works", () => {
    render(
      <TestWrapper>
        <AddListing />
      </TestWrapper>
    );

    // Fill out form
    const titleInput = screen.getByLabelText(/Property Title/);
    const priceInput = screen.getByLabelText(/Price/);

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(priceInput, { target: { value: "200000" } });

    // Reset form
    fireEvent.click(screen.getByText("Reset Form"));

    expect(titleInput.value).toBe("");
    expect(priceInput.value).toBe("");
  });
});
