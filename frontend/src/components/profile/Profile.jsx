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
  LogOut,
  Pencil,
  X,
  Save,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function Profile({
  user,
  savedCount = 0,
  orderCount = 0,
  onSaved,
  onOrders,
  onAdmin,
  onLogout,
  onUserUpdate,
}) {
  const [isDarkMode, setIsDarkMode] =
    useState(() => {
      return document.documentElement.classList.contains(
        "dark"
      );
    });

  const [showEditProfile, setShowEditProfile] =
    useState(false);

  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(
        document.documentElement.classList.contains(
          "dark"
        )
      );
    };

    updateMode();

    const observer =
      new MutationObserver(updateMode);

    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["class"],
      }
    );

    return () =>
      observer.disconnect();
  }, []);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  const toggleDarkMode = () => {
    const currentlyDark =
      document.documentElement.classList.contains(
        "dark"
      );

    const newDarkMode =
      !currentlyDark;

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

  const openEditProfile = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setError("");
    setSuccess("");
    setShowEditProfile(true);
  };

  const closeEditProfile = () => {
    if (saving) {
      return;
    }

    setShowEditProfile(false);
    setError("");
    setSuccess("");
  };

  const handleSaveProfile = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !email.trim()
    ) {
      setError(
        "Name and email are required."
      );

      return;
    }

    const token =
      localStorage.getItem(
        "golocal-token"
      );

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          `${API_URL}/api/users/me`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              profileImage:
                user?.profileImage || "",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      const updatedUser =
        data.user;

      localStorage.setItem(
        "golocal-user",
        JSON.stringify(
          updatedUser
        )
      );

      if (onUserUpdate) {
        onUserUpdate(
          updatedUser
        );
      }

      setSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setShowEditProfile(false);
        setSuccess("");
      }, 700);
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
            <User
              size={30}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
              {user?.name ||
                "GoLocal User"}
            </h2>

            <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
              {user?.email ||
                "No email available"}
            </p>
          </div>

          <button
            onClick={
              openEditProfile
            }
            className="
              flex
              h-10
              w-10
              shrink-0
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
            aria-label="Edit profile"
          >
            <Pencil size={17} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          style={{
            animation:
              "profileCardIn 0.4s ease-out both",
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <Heart
              size={18}
              fill="currentColor"
            />
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
            animation:
              "profileCardIn 0.4s ease-out 0.08s both",
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
          <Sparkles
            size={16}
            className="text-blue-500"
          />

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
              <Heart
                size={17}
                fill="currentColor"
              />
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

      <div className="px-4 pt-6">
        <button
          onClick={onLogout}
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-red-100
            bg-white
            text-sm
            font-bold
            text-red-500
            shadow-sm
            transition-all
            duration-200
            hover:bg-red-50
            active:scale-[0.985]
            dark:border-red-900/40
            dark:bg-gray-900
            dark:text-red-400
            dark:hover:bg-red-950/30
          "
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>

      <div className="px-4 pb-6 pt-8 text-center">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
          GoLocal Prototype
        </p>

        <p className="mt-1 text-[11px] text-gray-300 dark:text-gray-600">
          Explore • Discover • GoLocal
        </p>
      </div>

      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-4 pb-6"
          onClick={closeEditProfile}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-gray-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Update your account information
                </p>
              </div>

              <button
                onClick={
                  closeEditProfile
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-400">
                {success}
              </div>
            )}

            <form
              onSubmit={
                handleSaveProfile
              }
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
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
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
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
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Phone
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="Enter your phone number"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
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

              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-500
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-600
                  active:scale-[0.98]
                  disabled:cursor-wait
                  disabled:opacity-60
                "
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

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