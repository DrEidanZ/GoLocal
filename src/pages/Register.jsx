import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";

function Register({ onRegister, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError(
        "Name, email, and password are required."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed."
        );
      }

      localStorage.setItem(
        "golocal-token",
        data.token
      );

      localStorage.setItem(
        "golocal-user",
        JSON.stringify(data.user)
      );

      onRegister(data.user);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
          "Unable to register. Please try again."
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
            <UserPlus
              size={30}
              strokeWidth={2.2}
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
            Create your GoLocal account
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign up to start exploring.
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
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
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
              htmlFor="register-email"
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
                id="register-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
              htmlFor="register-password"
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
                id="register-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
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
              ? "Creating account..."
              : "Create Account"}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
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
            Already have an account? Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          GoLocal • Explore • Discover • GoLocal
        </p>
      </div>
    </div>
  );
}

export default Register;