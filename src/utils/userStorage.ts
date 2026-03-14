/**
 * User Storage Helper
 * 
 * Manages user ID storage for the app
 * Uses in-memory storage for now (AsyncStorage can be added later)
 */

/**
 * Store for real Convex user ID
 * This is set after calling getOrCreateDemoUser mutation
 */
let cachedUserId: string | null = null;

/**
 * Set the current user's Convex ID
 * This should be called after getting the user ID from Convex
 */
export const setUserId = (userId: string): void => {
  cachedUserId = userId;
};

/**
 * Get current user ID
 * Returns cached Convex user ID or null if not set
 */
export const getUserId = (): string | null => {
  return cachedUserId;
};

/**
 * Type for user data
 */
export interface UserData {
  id: string;
  studentId: string;
  name: string;
  faculty: string;
  points: number;
}

/**
 * Mock user data for demo/fallback
 */
export const getDemoUser = (): UserData => {
  return {
    id: 'demo',
    studentId: 'DEMO_USER_LIBGO_123',
    name: 'Demo Student',
    faculty: 'Computer Science',
    points: 0,
  };
};

