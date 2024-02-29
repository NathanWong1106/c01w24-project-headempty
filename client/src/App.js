import { Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import { DrawerWithNavigation } from './components/Drawer';
import { ROUTES } from './routing/RouteConstants';


function App() {
  const location = useLocation();

  if (location.pathname === ROUTES.BASE) {
    return (
      <Navigate to={ROUTES.HOME} />
    )
  }

  return (
    <div>
      {location.pathname != ROUTES.LOGIN && <DrawerWithNavigation />}
      <Outlet />
    </div>
  )

}

export default App;
