import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/app/Redux/store';
import { ConnectionStatusIndicator, ConnectionStatusProvider } from './src/app/UI/ConnectionStatusProvider';

export default function App() {
  const theme = useColorScheme(); // Determine the current theme (light or dark)

  // Ensure the correct status bar style based on the theme
  useEffect(() => {
    StatusBar.setHidden(false); // Ensure the status bar is visible
    if (theme === 'dark') {
      StatusBar.setBarStyle('light-content'); // Light content (white text) for dark theme
    } else {
      StatusBar.setBarStyle('dark-content'); // Dark content (black text) for light theme
    }
  }, [theme]);

  return (
    <ConnectionStatusProvider>
      <Provider store={store}>
        <SafeAreaProvider>
          <ConnectionStatusIndicator />
        </SafeAreaProvider>
      </Provider>
    </ConnectionStatusProvider>
  );
}
