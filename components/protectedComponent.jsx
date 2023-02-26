
import withAuthentication from "./withAuthentication";

function ProtectedComponent() {
  return <div>This component is protected and can only be accessed if the user is authenticated.</div>;
}

export default withAuthentication(ProtectedComponent);
