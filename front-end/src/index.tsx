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
import { CountriesPage } from './pages/CountriesPage';
import { PeoplePage } from './pages/PeoplePage';
import { OneProductionCountry } from './pages/OneCountryPage';
import { GeneralEntityPageSkeleton } from './components/generalEntityPage/GeneralEntityPageSkeleton';

const queryClient = new QueryClient(({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
    },
  },
}));

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // main:  "#13a155",
      main:  "#c9322a",
      // light: "#bcf7cb",
      light: "#c96e69",
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
              <Route path="/"                       element={<App />} />
              <Route path="/genres"                 element={<GeneralEntityPageSkeleton name='Genres' searchName='genre' keyField="name" />} />
              <Route path="/keywords"               element={<GeneralEntityPageSkeleton name='Keywords' searchName='keyword' keyField="name" />} />
              <Route path="/languages"              element={<GeneralEntityPageSkeleton name='Languages' searchName='language' keyField="iso_639_1" />} />
              <Route path="/companies"              element={<GeneralEntityPageSkeleton name='ProductionCompanies' searchName='company' keyField="name" headerName="Production Companies" />} />
              <Route path="/people"                 element={<GeneralEntityPageSkeleton name='People' searchName='person (actor, director)' keyField="id" />} />
              <Route path="/countries"              element={<CountriesPage />} />
              <Route path="/countries/:iso_3166_1"  element={<OneProductionCountry />} />
              <Route path="/users"                  element={<Users /> }       />
              <Route path="/contacts"               element={<ContactsPage />} />
              <Route path="/explore"                element={<Explore />} />
              <Route path="/repos"                  element={<Repositories />} />
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
