import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Store,
  Pencil,
  X,
} from "lucide-react";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

function AdminRestaurants({ onBack }) {
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Food",
    latitude: "",
    longitude: "",
    logo: "",
  });

  const [adding, setAdding] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [editing, setEditing] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/restaurants`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch restaurants."
        );
      }

      const data = await response.json();

      setRestaurants(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not connect to the GoLocal backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "Food",
      latitude: "",
      longitude: "",
      logo: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      form.latitude === "" ||
      form.longitude === ""
    ) {
      setError(
        "Name, latitude, and longitude are required."
      );

      return;
    }

    try {
      setError("");

      const isEditing = editingId !== null;

      if (isEditing) {
        setEditing(true);
      } else {
        setAdding(true);
      }

      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/api/restaurants/${encodeURIComponent(
              editingId
            )}`
          : `${API_BASE_URL}/api/restaurants`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            logo: form.logo.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update restaurant."
              : "Failed to create restaurant.")
        );
      }

      if (isEditing) {
        setRestaurants((current) =>
          current.map((restaurant) =>
            restaurant.id === editingId
              ? data.restaurant
              : restaurant
          )
        );
      } else {
        setRestaurants((current) => [
          data.restaurant,
          ...current,
        ]);
      }

      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          (editingId !== null
            ? "Failed to update restaurant."
            : "Failed to add restaurant.")
      );
    } finally {
      setAdding(false);
      setEditing(false);
    }
  };

  const handleEdit = (restaurant) => {
    setError("");

    setEditingId(restaurant.id);

    setForm({
      name: restaurant.name || "",
      description: restaurant.description || "",
      category: restaurant.category || "Food",
      latitude:
        restaurant.latitude !== undefined
          ? String(restaurant.latitude)
          : "",
      longitude:
        restaurant.longitude !== undefined
          ? String(restaurant.longitude)
          : "",
      logo: restaurant.logo || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setError("");
  };

  const handleDelete = async (restaurant) => {
    const confirmed = window.confirm(
      `Delete "${restaurant.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(restaurant.id);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/restaurants/${encodeURIComponent(
          restaurant.id
        )}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        if (text) {
          console.error(
            "Non-JSON delete response:",
            text
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Delete request failed with status ${response.status}.`
        );
      }

      setRestaurants((current) =>
        current.filter(
          (item) => item.id !== restaurant.id
        )
      );

      if (editingId === restaurant.id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete restaurant."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const isEditing = editingId !== null;

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 pb-8 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="
            mb-5
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            font-semibold
            text-gray-700
            transition
            hover:bg-gray-200
            dark:text-gray-200
            dark:hover:bg-gray-800
          "
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-green-100
                text-green-600
                dark:bg-green-950/50
                dark:text-green-400
              "
            >
              <Store size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Restaurants
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add and manage restaurants in GoLocal
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={20} />
                )}

                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEditing
                    ? "Edit Restaurant"
                    : "Add Restaurant"}
                </h2>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  title="Cancel editing"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                    dark:hover:bg-gray-800
                    dark:hover:text-gray-200
                  "
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Restaurant name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description"
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "
                >
                  <option value="Food">
                    Food
                  </option>

                  <option value="Hotels">
                    Hotels
                  </option>

                  <option value="Delivery">
                    Delivery
                  </option>

                  <option value="Rides">
                    Rides
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="10.3157"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-green-500
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                    "
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="123.8854"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-green-500
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                    "
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Logo URL
                </label>

                <input
                  type="text"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "
                />
              </div>

              <div className="flex gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-gray-700
                      transition
                      hover:bg-gray-100
                      dark:border-gray-700
                      dark:text-gray-200
                      dark:hover:bg-gray-800
                    "
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={adding || editing}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-600
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-green-700
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isEditing ? (
                    <Pencil size={18} />
                  ) : (
                    <Plus size={18} />
                  )}

                  {editing
                    ? "Saving..."
                    : adding
                    ? "Adding..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Restaurant"}
                </button>
              </div>
            </div>
          </form>

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Restaurants
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {restaurants.length} stored
                </p>
              </div>

              <button
                type="button"
                onClick={fetchRestaurants}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  dark:border-gray-700
                  dark:text-gray-200
                  dark:hover:bg-gray-800
                "
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading restaurants...
              </div>
            ) : restaurants.length === 0 ? (
              <div className="rounded-xl bg-gray-50 px-4 py-10 text-center dark:bg-gray-800/50">
                <Store
                  size={30}
                  className="mx-auto mb-3 text-gray-400"
                />

                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No restaurants yet
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add your first restaurant using the
                  form.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-gray-100
                      p-3
                      dark:border-gray-800
                    "
                  >
                    {restaurant.logo ? (
                      <img
                        src={restaurant.logo}
                        alt=""
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-xl
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-gray-100
                          text-gray-400
                          dark:bg-gray-800
                        "
                      >
                        <Store size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {restaurant.name}
                      </p>

                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {restaurant.category}
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {restaurant.latitude},{" "}
                        {restaurant.longitude}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(restaurant)
                      }
                      disabled={
                        deletingId === restaurant.id
                      }
                      title="Edit restaurant"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-700
                        active:scale-90
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        dark:hover:bg-gray-800
                        dark:hover:text-gray-200
                      "
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(restaurant)
                      }
                      disabled={
                        deletingId === restaurant.id
                      }
                      title="Delete restaurant"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-red-500
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        active:scale-90
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        dark:hover:bg-red-950/30
                      "
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurants;