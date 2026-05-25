import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_USER, LOGIN_USER } from "../../graphql/mutations/Auth";
import "./AuthPage.scss";
import { useMutation } from "@apollo/client/react";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [login, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_USER);

  const [createUser, { loading: createLoading, error: createError }] =
    useMutation(CREATE_USER);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isLogin) {
        const { data } = await login({
          variables: { input: { email, password } },
        });

        if (data?.login?.token) {
          localStorage.setItem("token", data.login.token);
        }
        navigate("/");
      } else {
        const { data } = await createUser({
          variables: { input: { email, password } },
        });

        if (data?.createUser?.token) {
          localStorage.setItem("token", data.createUser.token);
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  useEffect(() => {
    if (loginError) {
      console.log(loginError);
    }
    if (createError) {
      console.log(createError);
    }
  }, [loginError, createError]);

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h1 className="auth__title">{isLogin ? "Вход" : "Регистрация"}</h1>
          <button
            type="button"
            className="auth__toggle"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? (
              <>
                Нет аккаунта?{" "}
                <span style={{ textDecoration: "underline" }}>
                  Зарегистрироваться
                </span>
              </>
            ) : (
              "Уже есть аккаунт? Войти"
            )}
          </button>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="email">
              Email
            </label>
            <input
              className="auth__input"
              id="email"
              name="email"
              type="text"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="password">
              Пароль
            </label>
            <input
              className="auth__input"
              id="password"
              name="password"
              type="password"
              required
              minLength={1}
              placeholder="••••••••"
            />
          </div>

          {(loginError || createError) && (
            <p className="auth__error">Ошибка авторизации</p>
          )}

          <button
            type="submit"
            className="auth__button"
            disabled={loginLoading || createLoading}
          >
            {loginLoading || createLoading
              ? "Загрузка..."
              : isLogin
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>

        <a href="#" className="auth__link">
          Забыли пароль?
        </a>
      </div>
    </div>
  );
}
