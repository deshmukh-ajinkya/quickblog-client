import jwt, { JwtPayload } from 'jsonwebtoken';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token'); // Adjust if you're using cookies
  }
  return null;
};

// Function to verify and decode JWT
export function verifyToken(token: string): JwtPayload | null {
  // Decode the token without verification
  const decoded = jwt.decode(token) as JwtPayload | null; // Type assertion to handle null case

  // Check if decoded is null
  if (!decoded) {
    return null; // Token is invalid or could not be decoded
  }

  // Check if the token is expired
  const currentTime = Date.now() / 1000; // Current time in seconds
  if (decoded.exp && decoded.exp < currentTime) {
    localStorage.removeItem('token');
    return null; // Token is expired
  }
  return decoded; // Token is valid
}
