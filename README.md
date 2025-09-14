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


### Key Design Decisions

1.  In-Memory Storage vs Database

Python dictionaries for data storage, reasons I chose are as per below:

- Fastest to implement and test
- No setup/installation requirements
- Perfect for interview/demo scenarios
- Data doesn't persist between server restarts
- **Future**: Easy migration to SQLite/PostgreSQL

2.  Vanilla CSS vs CSS Frameworks

Choice: Custom CSS with CSS modules approach
Reasons below listed:

- Full design control and customization
- No external dependencies
- Demonstrates CSS skills
- Smaller bundle size
- More development time than frameworks
- Alternative: Could use Tailwind/Bootstrap for faster development

3.  Client-Side vs Server-Side Validation

**Choice**: Primary validation on client-side, basic validation on server
Reasons for it:

- Better user experience with immediate feedback
- Reduces server load
- Security relies on client-side code
- Production: Would add comprehensive server-side validation

4. Mock AI vs Real AI Integration

Choice: Mock AI responses for summary generation
Reasons for it:

- No API keys or external dependencies required
- Consistent, predictable responses for testing
- Demonstrates integration pattern
- Future: Easy to swap with OpenAI/Gemini APIs



