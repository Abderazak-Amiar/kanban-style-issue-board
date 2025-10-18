import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../moleculs/LoginForm';

function login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default login;
