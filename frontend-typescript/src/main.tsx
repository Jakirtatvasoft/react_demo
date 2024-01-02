import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@material-tailwind/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

// Store(Redux)
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import rootReducer from './store/reducers/index'
import thunk from 'redux-thunk'
import { MaterialTailwindControllerProvider } from './context';

const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <RouterProvider router={router} />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </Provider>
  // </React.StrictMode>,
)
