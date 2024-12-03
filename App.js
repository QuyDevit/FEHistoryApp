import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#FF6B00" />
          <AppNavigator />
          <FlashMessage position="top" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
