const http = require('http');

// Replace with actual admin JWT token from localStorage
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

const postData = JSON.stringify({});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/books/sample',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();