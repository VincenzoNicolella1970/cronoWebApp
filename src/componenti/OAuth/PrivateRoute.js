import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const {user, token} = useAuth();
  if (!token) return <Navigate to={process.env.PUBLIC_URL +"/Login"} />;
  return <Outlet />;
};

export default PrivateRoute;