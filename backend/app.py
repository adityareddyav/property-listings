from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# In-memory storage (replace with database in production)
listings = {}

# Sample data for testing
sample_listings = [
    {
        "id": str(uuid.uuid4()),
        "title": "Modern Downtown Apartment",
        "price": 350000,
        "location": "Downtown Seattle, WA",
        "description": "Beautiful 2-bedroom apartment with city views, modern amenities, and walking distance to shops and restaurants.",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Cozy Suburban House",
        "price": 480000,
        "location": "Bellevue, WA",
        "description": "Charming 3-bedroom house with large backyard, perfect for families. Updated kitchen and bathrooms.",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Luxury Waterfront Condo",
        "price": 750000,
        "location": "Lake Washington, WA",
        "description": "Stunning waterfront condominium with panoramic lake views, high-end finishes, and resort-style amenities.",
        "created_at": datetime.now().isoformat()
    }
]

# Initialize with sample data
for listing in sample_listings:
    listings[listing['id']] = listing

@app.route('/api/listings', methods=['GET'])
def get_listings():
    """Get all listings with optional search functionality"""
    search_query = request.args.get('search', '').lower()
    
    if search_query:
        # Simple search implementation - searches title, location, and description
        filtered_listings = []
        for listing in listings.values():
            if (search_query in listing['title'].lower() or 
                search_query in listing['location'].lower() or 
                search_query in listing['description'].lower()):
                filtered_listings.append(listing)
        return jsonify(filtered_listings)
    
    return jsonify(list(listings.values()))

@app.route('/api/listings', methods=['POST'])
def create_listing():
    """Create a new listing"""
    data = request.get_json()
    
    # Basic validation
    required_fields = ['title', 'price', 'location', 'description']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate price is a number
    try:
        price = float(data['price'])
        if price <= 0:
            return jsonify({'error': 'Price must be a positive number'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Price must be a valid number'}), 400
    
    # Create new listing
    listing_id = str(uuid.uuid4())
    new_listing = {
        'id': listing_id,
        'title': data['title'].strip(),
        'price': price,
        'location': data['location'].strip(),
        'description': data['description'].strip(),
        'created_at': datetime.now().isoformat()
    }
    
    listings[listing_id] = new_listing
    
    return jsonify(new_listing), 201

@app.route('/api/listings/<listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Get a specific listing by ID"""
    listing = listings.get(listing_id)
    
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    return jsonify(listing)

@app.route('/api/listings/<listing_id>/summary', methods=['POST'])
def generate_summary(listing_id):
    """Generate AI summary for a listing (mock implementation)"""
    listing = listings.get(listing_id)
    
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    # Mock AI summary generation
    # In production, this would call OpenAI/Anthropic API
    mock_summaries = [
        [
            "Prime location with excellent walkability and transit access",
            "Modern amenities and updated fixtures throughout the property", 
            "Competitive pricing for the local market and property type"
        ],
        [
            "Spacious layout perfect for families or professionals",
            "Well-maintained property with recent renovations",
            "Great investment opportunity in a growing neighborhood"
        ],
        [
            "Stunning views and premium finishes justify the price point",
            "Low maintenance lifestyle with community amenities included",
            "Excellent resale potential in this desirable area"
        ]
    ]
    
    # Randomly select one of the mock summaries for demo purposes
    summary = random.choice(mock_summaries)
    
    return jsonify({
        'listing_id': listing_id,
        'summary': summary,
        'generated_at': datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'listings_count': len(listings)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Property Listings API...")
    print(f"Sample listings loaded: {len(listings)}")
    print("API will be available at: http://localhost:5002")
    print("\nEndpoints:")
    print("GET    /api/listings")
    print("POST   /api/listings") 
    print("GET    /api/listings/<id>")
    print("POST   /api/listings/<id>/summary")
    print("GET    /api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5002)