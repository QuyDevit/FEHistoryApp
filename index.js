/**
 * @format
 */


import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

// Tắt cảnh báo cụ thể
LogBox.ignoreLogs([
  'Warning: TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release.',
  'Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release.',
  'Warning: IMGElement: Support for defaultProps will be removed from function components in a future major release.'
]);

AppRegistry.registerComponent(appName, () => App);
