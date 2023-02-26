
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function withAuthentication(Component) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetch("http://localhost:3000/protect", { credentials: "include" })
        .then((response) => response.json())
        .then((data) => {
          setIsAuthenticated(data.isAuthenticated);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
}

export default withAuthentication;
