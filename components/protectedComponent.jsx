import withAuthentication from "./withAuthentication";

function ProtectedComponent() {

  return <div>Hello, {localStorage.getItem('name')}</div>;
}

export default withAuthentication(ProtectedComponent);
