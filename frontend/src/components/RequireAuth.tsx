
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return <>{children}</>;
};

export default RequireAuth;
