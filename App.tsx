import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/app/Redux/store';
import { ConnectionStatusIndicator, ConnectionStatusProvider } from './src/app/UI/ConnectionStatusProvider';

export default function App() {
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