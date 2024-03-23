import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../apiServices/types/userServiceTypes';
import { ROUTES } from './RouteConstants';


// Wrapper component to navigate to home page if not admin
const CoordinatorRoute = ({ children }) => {
    const user = useSelector(state => state.currentUser);

    if (!(user.accountType == ACCOUNT_TYPE.COORDINATOR)) {
        // Redirect them to the home page
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default CoordinatorRoute;