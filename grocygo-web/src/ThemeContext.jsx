import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.style.backgroundColor = isDarkMode ? '#0a192f' : '#f5f5f5';
    document.body.style.color = isDarkMode ? '#fff' : '#000';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#0a192f' : '#ffffff',
      paper: isDarkMode ? '#162447' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#bfc9d1' : '#666666',
      primary: isDarkMode ? '#4caf50' : '#2196f3',
      secondary: isDarkMode ? '#ff9800' : '#f50057',
      error: isDarkMode ? '#ff4444' : '#f44336',
      success: isDarkMode ? '#4caf50' : '#4caf50',
      divider: isDarkMode ? '#233554' : '#e0e0e0',
      cardBg: isDarkMode ? '#232b3e' : '#ffffff',
      hover: isDarkMode ? '#1f4068' : '#f5f5f5',
      border: isDarkMode ? '#233554' : '#e0e0e0',
      chartGrid: isDarkMode ? '#233554' : '#e0e0e0',
      chartText: isDarkMode ? '#bfc9d1' : '#666666'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
