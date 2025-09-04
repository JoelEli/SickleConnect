// Simple test script to check backend connectivity
const API_BASE = 'https://sickleconnect.onrender.com/api';

async function testConnection() {
  console.log('Testing backend connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test CORS with preflight
    console.log('2. Testing CORS preflight...');
    const corsResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://sickle-connect.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    
    // Test actual login endpoint (with dummy data)
    console.log('3. Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://sickle-connect.vercel.app'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login test status:', loginResponse.status);
    console.log('Login test response:', loginData);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
