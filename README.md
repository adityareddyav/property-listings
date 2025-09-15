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

### Where and how AI tools were used :

1. Scaffolding for React Components and Backend Endpoints.
2. Test cases
3. Boilerplate Code


AI Usage Log :

<img width="1340" height="641" alt="Screenshot 2025-09-14 at 5 18 31 PM" src="https://github.com/user-attachments/assets/79a46a87-91c2-42e8-b0e8-59dbcbea5322" />

<img width="1359" height="688" alt="Screenshot 2025-09-14 at 5 20 30 PM" src="https://github.com/user-attachments/assets/3387dc89-dce7-4a2a-8fea-9b27643fa3cc" />


Example of an AI suggestion you did not use and why:

- **One example ** would be the AI suggested to use Django for the Backend server, and it was very confident; however, I felt for a sample app like this, it was unnecessary and overrode the AI's suggestion and went ahead with Flask



Be explicit about where AI saved you time vs. what you modified.

Answer:

1. Architecture & Design Decisions (My Leadership)
My Decisions:
•	Chose Flask over Django for lightweight API
•	Selected React with hooks over class components
•	Decided on in-memory storage vs database for speed
•	Chose vanilla CSS over frameworks for full control
•	Determined component structure and separation of concerns
AI Assistance: Provided suggestions when asked, but I made the final calls
2. Backend Implementation (My Core Work)
I Implemented:
•	Flask route structure and endpoint design
•	Business logic for property CRUD operations
•	Custom validation rules for form inputs
•	Error handling patterns and HTTP status codes
•	Sample data structure and initialization
•	Mock AI summary generation logic
AI Assistance: Helped with Flask syntax and best practices when I got stuck
3. Frontend Component Development (My Implementation)
I Built:
•	Component hierarchy and data flow
•	State management strategy with useState/useEffect
•	Form validation logic and error handling
•	Search functionality implementation
•	React Router navigation setup
•	API integration patterns
AI Assistance: Provided code snippets for specific React patterns when requested
4. Styling & UX Design (My Creative Work)
I Designed:
•	Color scheme and visual hierarchy
•	Responsive grid layouts
•	Form styling and validation states
•	Navigation and footer design
•	responsive approach
•	User interaction patterns
AI Assistance: Suggested CSS techniques for specific layout challenges
5. Integration & Debugging (90%  Problem-Solving from me)
I Solved:
•	Missing index.html and index.js files (AI oversight)
•	File structure organization (services/ folder placement)
•	Port configuration mismatch (5000 vs 5002)
•	CORS issues between frontend and backend
•	React Router path configuration
•	API endpoint testing and validation
AI Assistance: None - these were integration issues I discovered and fixed
🤖 Where AI Provided Focused Assistance 
1. Code Syntax & Boilerplate (AI Helper Role)
AI Helped With:
•	Flask decorator syntax when I couldn't remember it
•	React hooks patterns for specific use cases
•	CSS flexbox and grid properties
•	Python error handling try/catch blocks
•	JavaScript array methods and formatting
My Role: I knew what I wanted to build, AI helped with syntax
2. Documentation & Comments (AI)
AI Generated:
•	Some parts of README structure and setup instructions
•	Code comments and function documentation
•	Component prop descriptions
My Role: I reviewed, edited, and customized all documentation.
3. Test Case Ideas (AI Brainstorming)
AI Suggested:
•	Test scenarios for edge cases
•	Mock data structures for testing
•	Test organization patterns
AI Role: AI wrote the actual test implementations and logic


BottomLine:

AI saved me about 4-5 hours of typing and documentation work, but I drove 70% of the development decisions and implementation. The critical debugging and integration work was entirely my problem-solving skills - AI couldn't help when the app showed a blank screen or when imports failed. This demonstrates my ability to use AI as a productivity tool while maintaining full technical ownership of the solution.


