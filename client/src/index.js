import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import store from './store/store';
import { Provider } from 'react-redux';
import LoginPage from './pages/Login';
import HomePage from './pages/HomePage';
import PrivateRoute from './routing/PrivateRoute';
import { ADMIN_ROUTE_BASE, ADMIN_ROUTES, PRESCRIBER_ROUTE_BASE, PRESCRIBER_ROUTES, ROUTES } from './routing/RouteConstants';
import AdminRoute from './routing/AdminRoute';
import PrescriberRoute from './routing/PrescriberRoute';
import PrescriberManagement from './pages/admin/PrescriberManagement';
import PrescriberPrescriptions from './pages/prescriber/PrescriberPrescriptions';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={ROUTES.BASE} element={<App />}>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.HOME} element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path={PRESCRIBER_ROUTE_BASE} element={<PrescriberRoute />}>
        <Route path={PRESCRIBER_ROUTES.PRESCRIPTIONS} element={<PrescriberPrescriptions />}/>
      </Route>
      <Route path={ADMIN_ROUTE_BASE} element={<AdminRoute />}>
        <Route path={ADMIN_ROUTES.PRESCRIBER_MNGMT} element={<PrescriberManagement />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
