import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './pages/App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Repositories } from './pages/Repositories';
import { ContactsPage } from './pages/ContactsPage';
import { Explore } from './pages/Explore';
import { createTheme, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Users } from './pages/Users';

const queryClient = new QueryClient(({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
    },
  },
}));

const theme = createTheme({
  palette: {
    // mode: "dark",
    primary: {
      main:  "#13a155",
      light: "#bcf7cb",
    }
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/"           element={<App />} />
              <Route path="/users"      element={<Users /> }       />
              <Route path="/contacts"   element={<ContactsPage />} />
              <Route path="/explore"    element={<Explore />} />
              <Route path="/repos"      element={<Repositories />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
