import { useState } from "react";
import {
  Mail,
  Lock,
  LogIn,
} from "lucide-react";

function Login({
  onLogin,
  onRegister,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Email and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      localStorage.setItem(
        "golocal-token",
        data.token
      );

      localStorage.setItem(
        "golocal-user",
        JSON.stringify(
          data.user
        )
      );

      onLogin(data.user);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-5 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            <LogIn
              size={30}
              strokeWidth={2.2}
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to GoLocal
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue exploring.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email"
                autoComplete="email"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-11
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-11
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              mt-6
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-500
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              duration-200
              hover:bg-blue-600
              active:scale-[0.98]
              disabled:cursor-wait
              disabled:opacity-60
            "
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="
              mt-3
              h-12
              w-full
              rounded-xl
              text-sm
              font-semibold
              text-blue-500
              transition
              hover:bg-blue-50
              dark:hover:bg-blue-950/30
            "
          >
            Don't have an account? Create one
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          GoLocal • Explore • Discover • GoLocal
        </p>
      </div>
    </div>
  );
}

export default Login;