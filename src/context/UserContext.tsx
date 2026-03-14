/**
 * User Context Provider
 * 
 * Manages the logged-in user state across the app
 * Store and retrieve the current user's ID and profile
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  _id: string;
  studentId: string;
  name: string;
  faculty: string;
  points: number;
}

interface UserContextType {
  currentUser: User | null;
  userId: string | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        userId: currentUser?._id || null,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
