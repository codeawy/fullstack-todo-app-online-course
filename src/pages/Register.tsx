import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4">
        <Input placeholder="Username" />
        <Input placeholder="Email address" />
        <Input placeholder="Password" />

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
