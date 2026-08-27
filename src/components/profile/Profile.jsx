import { useEffect, useState } from "react";

import {
  User,
  Heart,
  ShoppingBag,
  MapPin,
  Bell,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Settings,
} from "lucide-react";

function Profile({
  savedCount = 0,
  orderCount = 0,
  onSaved,
  onOrders,
  onAdmin,
}) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(
        document.documentElement.classList.contains("dark")
      );
    };

    updateMode();

    const observer = new MutationObserver(updateMode);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const currentlyDark =
      document.documentElement.classList.contains("dark");

    const newDarkMode = !currentlyDark;

    document.documentElement.classList.toggle(
      "dark",
      newDarkMode
    );

    localStorage.setItem(
      "golocal-dark-mode",
      newDarkMode ? "true" : "false"
    );

    setIsDarkMode(newDarkMode);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-24 dark:bg-gray-950">
      <div className="relative overflow-hidden bg-white px-5 pb-6 pt-6 dark:bg-gray-900">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl dark:bg-blue-900/30" />

        <div className="pointer-events-none absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-blue-50 blur-2xl dark:bg-blue-950/40" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-500">
              GoLocal
            </p>

            <h1 className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
          </div>

          <button
            onClick={toggleDarkMode}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-blue-50
              text-blue-500
              transition-all
              duration-200
              hover:bg-blue-100
              active:scale-90
              dark:bg-blue-950/50
              dark:text-blue-400
              dark:hover:bg-blue-900/50
            "
            aria-label={
              isDarkMode
                ? "Currently dark mode"
                : "Currently light mode"
            }
          >
            {isDarkMode ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
        </div>

        <div className="relative mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            <User size={30} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
              GoLocal User
            </h2>

            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Exploring the city
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          style={{
            animation: "profileCardIn 0.4s ease-out both",
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <Heart size={18} fill="currentColor" />
          </div>

          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {savedCount}
          </p>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Saved places
          </p>
        </div>

        <div
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          style={{
            animation: "profileCardIn 0.4s ease-out 0.08s both",
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400">
            <ShoppingBag size={18} />
          </div>

          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {orderCount}
          </p>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Orders
          </p>
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={16} className="text-blue-500" />

          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Quick Access
          </h2>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <button
            onClick={onSaved}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.985] active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-transform duration-200 ease-out active:scale-90 dark:bg-red-950/40">
              <Heart size={17} fill="currentColor" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Saved places
              </p>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                View your favorite spots
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 dark:text-gray-600"
            />
          </button>

          <div className="mx-4 border-t border-gray-100 dark:border-gray-800" />

          <button
            onClick={onOrders}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.985] active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-transform duration-200 ease-out active:scale-90 dark:bg-blue-950/40 dark:text-blue-400">
              <ShoppingBag size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                My orders
              </p>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Check your recent orders
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 dark:text-gray-600"
            />
          </button>
        </div>
      </div>

      <div className="px-4 pt-5">
        <h2 className="px-1 text-sm font-bold text-gray-900 dark:text-white">
          Preferences
        </h2>

        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <button
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.985] active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500 transition-transform duration-200 ease-out active:scale-90 dark:bg-yellow-950/30">
              <Bell size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Notifications
              </p>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Stay updated about your orders
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 dark:text-gray-600"
            />
          </button>

          <div className="mx-4 border-t border-gray-100 dark:border-gray-800" />

          <button
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.985] active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-500 transition-transform duration-200 ease-out active:scale-90 dark:bg-green-950/30">
              <MapPin size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Location
              </p>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Manage your location preferences
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 dark:text-gray-600"
            />
          </button>

          <div className="mx-4 border-t border-gray-100 dark:border-gray-800" />

          <button
            onClick={onAdmin}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.985] active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-500 transition-transform duration-200 ease-out active:scale-90 dark:bg-purple-950/40 dark:text-purple-400">
              <Settings size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Admin Panel
              </p>

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Manage GoLocal restaurants
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 dark:text-gray-600"
            />
          </button>
        </div>
      </div>

      <div className="px-4 pb-6 pt-8 text-center">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
          GoLocal Prototype
        </p>

        <p className="mt-1 text-[11px] text-gray-300 dark:text-gray-600">
          Explore • Discover • GoLocal
        </p>
      </div>

      <style>
        {`
          @keyframes profileCardIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Profile;