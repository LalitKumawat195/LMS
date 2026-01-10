import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, loadTheme } from '@fluentui/react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }
});

const darkTheme = createTheme({
  palette: {
    themePrimary: '#4fc3f7',
    themeLighterAlt: '#03080a',
    themeLighter: '#0c1f28',
    themeLight: '#173a4a',
    themeTertiary: '#2e7494',
    themeSecondary: '#42a9d9',
    themeDarkAlt: '#5fc6f8',
    themeDark: '#7dccf9',
    themeDarker: '#a6d8fb',
    neutralLighterAlt: '#1a1a1a',
    neutralLighter: '#212121',
    neutralLight: '#2f2f2f',
    neutralQuaternaryAlt: '#373737',
    neutralQuaternary: '#3f3f3f',
    neutralTertiaryAlt: '#595959',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#121212',
  }
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    loadTheme(isDark ? darkTheme : lightTheme);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    document.body.style.backgroundColor = isDark ? '#121212' : '#faf9f8';
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme: isDark ? darkTheme : lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};