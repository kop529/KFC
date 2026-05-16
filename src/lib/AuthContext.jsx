import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    id: 'mock-user-id',
    email: 'user@example.com',
    full_name: 'Mock User'
  });
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: true, 
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: {},
      authChecked: true,
      logout: () => console.log('Logout mocked'),
      navigateToLogin: () => console.log('Navigate to login mocked'),
      checkUserAuth: () => Promise.resolve(),
      checkAppState: () => Promise.resolve()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
