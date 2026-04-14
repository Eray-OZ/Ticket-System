import http from 'k6/http';
import { check } from 'k6';

// 1. Test Configuration (Extreme Load)
export const options = {
  // 1000 Virtual Users attacking concurrently
  vus: 1000, 
  // Non-stop attack for 30 seconds
  duration: '30s',
};

// 2. Execution Block
export default function () {
  const url = 'http://localhost:3000/orders';
  
  // Randomly pick a user (1-1000) and a ticket (1-10)
  const payload = JSON.stringify({
    userId: Math.floor(Math.random() * 1000) + 1,
    ticketId: Math.floor(Math.random() * 10) + 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 3. Fire the Request
  const res = http.post(url, payload, params);

  // 4. Track the Chaos (No thresholds, just logging the results)
  check(res, {
    'is created (201)': (r) => r.status === 201,
    'is out of stock (400)': (r) => r.status === 400,
    // If PostgreSQL pool exhausts or deadlocks occur, this will spike
    'is server error (500)': (r) => r.status === 500, 
  });
}