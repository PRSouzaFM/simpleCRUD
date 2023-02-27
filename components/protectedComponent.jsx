import { useEffect } from "react";
import withAuthentication from "./withAuthentication";

function ProtectedComponent() {
  useEffect(() => {
  }, [])
  return <div>Hello, {localStorage.getItem('name')}</div>;
}

export default withAuthentication(ProtectedComponent);
