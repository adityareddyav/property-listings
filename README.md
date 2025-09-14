# Property Listings Application

A web application for managing property listings, built with React frontend and Python Flask for backend.

### Prerequisites

- Node.js 16+
- Python 3.8+

### Installation & Setup

1. Clone the repository

   git clone https://github.com/adityareddyav/property-listings/ and then
   cd property-listings

2. Backend Setup

   ```bash
   cd backend
   python -m venv venv

   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   python app.py
   ```

   Backend will run on: http://localhost:5002

3. Frontend Setup (do this in a new trminal)

   ```bash
   cd frontend
   npm install
   npm start
   ```

   Frontend will run on: http://localhost:3000

### Completed Features

- **Property Listings**: View all properties with search functionality
- **Property Details**: Detailed view with AI-generated summaries
- **Add Listings**: Form-based property creation with validation
- **Search**: Real-time search across title, location, and description
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Graceful error states and user feedback
- **Testing**: Comprehensive test coverage for both frontend and backend


