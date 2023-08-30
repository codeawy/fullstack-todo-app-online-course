import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = data => console.log("DATA", data);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            placeholder="Username"
            {...register("username", {
              required: true,
              minLength: 5,
            })}
          />
          {errors?.username && errors.username.type === "required" && <InputErrorMessage msg="Username is required." />}
          {errors?.username && errors.username.type === "minLength" && (
            <InputErrorMessage msg="Username should be at-least 5 characters." />
          )}
        </div>
        <div>
          <Input
            placeholder="Email address"
            {...register("email", {
              required: true,
              pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
            })}
          />
          {errors?.email && errors.email.type === "required" && <InputErrorMessage msg="Email is required." />}
          {errors?.email && errors.email.type === "pattern" && <InputErrorMessage msg="Not valid email." />}
        </div>

        <div>
          <Input
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
          />
          {errors?.password && errors.password.type === "required" && <InputErrorMessage msg="Password is required." />}
          {errors?.password && errors.password.type === "minLength" && (
            <InputErrorMessage msg="Password should be at-least 6 characters." />
          )}
        </div>

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
