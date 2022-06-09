import React from 'react';
import App from './components/App';
import { ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit'
import ColorReducer from './reducers/ColorReducer';
import RotationReducer from './reducers/RotationReducer';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    colors: ColorReducer,
    rotation: RotationReducer,
  }
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
