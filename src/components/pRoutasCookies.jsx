/** Allows route protection using backend data */
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const useRouteAccess = () => {

  const location = useLocation();
  const userProps = JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA)); 
  const allowedRoutes = userProps?.roles[0]?.menus || [];
  const hasAccess = allowedRoutes.some(menu => menu.route === location.pathname);
  return hasAccess;

};

export default useRouteAccess;