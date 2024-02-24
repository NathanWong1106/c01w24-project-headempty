import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


// Wrapper component to navigate to login page if not logged in
const PrivateRoute = ({ children }) => {
    const user = useSelector(state => state.currentUser);

    if (!user.loggedIn) {
        // Redirect them to the /login page
        return <Navigate to="/login" replace />;
    }

    return children;
}


export default PrivateRoute;