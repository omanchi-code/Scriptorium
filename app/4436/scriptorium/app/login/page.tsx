import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="container-page py-16 sm:py-24 max-w-sm">
      <p className="eyebrow mb-5">Studio Access</p>
      <h1 className="font-display text-4xl mb-10">Sign in</h1>
      <LoginForm />
    </div>
  );
}
