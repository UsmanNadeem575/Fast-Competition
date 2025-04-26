import React, {createContext, useState, useContext} from 'react';
import {Appearance} from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  );

  // Shared state (e.g., username, data, etc.)
  const [data, setData] = useState(0);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, data, setData}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
