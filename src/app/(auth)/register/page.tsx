import AuthLayout from "../../../components/auth/auth-layout";
import RegisterForm from "../../../components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Create an account to save your favorites, manage orders, and check out faster."
    >
      <RegisterForm />
    </AuthLayout>
  );
}