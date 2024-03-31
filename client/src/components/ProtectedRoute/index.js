import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({element}) => {
    const jwtToken = Cookies.get('jwtToken')
    if(jwtToken === undefined){
        return <Navigate to='/' />
    }
    return element
}

export default ProtectedRoute;


