import { Navigate } from "react-router-dom";
import * as keys from "./Axios/keys";
import * as storage from "./Axios/storage";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = storage.loadState(keys.LOGGED_IN_USER)?.user_id > 0; // Or your own auth logic

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;