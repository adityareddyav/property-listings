import pytest
import json
from app import app, listings

@pytest.fixture
def client():
    """Create a test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_listing():
    """Sample listing data for testing"""
    return {
        "title": "Test Property",
        "price": 250000,
        "location": "Test City, TS",
        "description": "A beautiful test property with all the amenities you need for testing."
    }

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'timestamp' in data
    assert 'listings_count' in data

def test_get_all_listings(client):
    """Test retrieving all listings - Happy Path"""
    response = client.get('/api/listings')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) >= 0

def test_create_listing_success(client, sample_listing):
    """Test creating a new listing - Happy Path"""
    response = client.post('/api/listings', 
                         data=json.dumps(sample_listing),
                         content_type='application/json')
    
    assert response.status_code == 201
    
    data = json.loads(response.data)
    assert data['title'] == sample_listing['title']
    assert data['price'] == sample_listing['price']

def test_create_listing_validation_errors(client):
    """Test listing creation validation - Edge Cases"""
    invalid_listing = {
        "price": 250000,
        "location": "Test City, TS", 
        "description": "A beautiful test property."
    }
    response = client.post('/api/listings',
                         data=json.dumps(invalid_listing),
                         content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data