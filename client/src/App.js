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
    <div className='bg-off-white'>
      {location.pathname != ROUTES.LOGIN && !location.pathname.includes(ROUTES.PRESCRIBER_REGISTRATION) && <DrawerWithNavigation />}
      <Outlet />
    </div>
  )

}

export default App;
