import {useEffect} from 'react';
import {useAuth} from "../contexts/FakeAuthContext.jsx";
import {useNavigate} from "react-router-dom";

function ProtectedRoute({children}) {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    isAuthenticated ? children : null
  );
}

export default ProtectedRoute;