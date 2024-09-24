import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { attemptLogin } from "../store/thunks/auth";
import { Error } from "../components";
import { Credentials } from "../store/actions/user";
import { useAppDispatch } from "../store/hooks";
import { useServerError } from "../hooks/useServerError";

type LoginFormValues = Credentials;

export default function LoginPage() {
  const { serverError, handleServerError } = useServerError();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().min(5).max(255).email().required("Required"),
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    dispatch(attemptLogin(values, navigate)).catch(handleServerError);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            id="email"
            type="text"
            placeholder="Email"
          />
          {errors.email && <Error>{errors.email.message}</Error>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Password"
          />
          {errors.password && <Error>{errors.password.message}</Error>}
        </div>
        <div>
          <Link to="/login/forgot">Forgot your password?</Link>
        </div>

        <button type="submit">Login</button>
        {serverError && <Error>{serverError}</Error>}
      </form>
      <b>Or</b>
      <Link to="/register">Sign Up</Link>
    </div>
  );
}
