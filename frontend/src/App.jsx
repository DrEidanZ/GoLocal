import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";

import SearchBar from "./components/search/SearchBar";
import CategoryBar from "./components/categories/CategoryBar";

import MapView from "./components/map/MapView";

import PlaceCard from "./components/places/PlaceCard";
import OrderPanel from "./components/orders/OrderPanel";
import Orders from "./components/orders/Orders";

import Profile from "./components/profile/Profile";
import Saved from "./components/profile/Saved";
import AdminRestaurants from "./components/admin/AdminRestaurants";

import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  CheckCircle,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("golocal-user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [showRegister, setShowRegister] =
    useState(false);

  const [category, setCategory] =
    useState("Food");

  const [search, setSearch] =
    useState("");

  const [tab, setTab] = useState(() => {
    const savedTab =
      localStorage.getItem(
        "golocal-active-tab"
      );

    const validTabs = [
      "explore",
      "orders",
      "saved",
      "profile",
      "admin",
    ];

    return validTabs.includes(savedTab)
      ? savedTab
      : "explore";
  });

  const [selectedPlace, setSelectedPlace] =
    useState(null);

  const [position, setPosition] =
    useState(null);

  const [cardPosition, setCardPosition] =
    useState(null);

  const [orderPlace, setOrderPlace] =
    useState(null);

  const [restaurants, setRestaurants] =
    useState([]);

  const [saved, setSaved] = useState(() => {
    const stored =
      localStorage.getItem("golocal-saved");

    return stored
      ? JSON.parse(stored)
      : [];
  });

  const [orders, setOrders] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [deliveryPopup, setDeliveryPopup] =
    useState(null);

  const [popupVisible, setPopupVisible] =
    useState(false);

  const [resetMap, setResetMap] =
    useState(0);

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "golocal-dark-mode"
        ) === "true"
      );
    });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "golocal-dark-mode",
      darkMode ? "true" : "false"
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "golocal-active-tab",
      tab
    );
  }, [tab]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/restaurants`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch restaurants."
          );
        }

        const data =
          await response.json();

        setRestaurants(
          (currentRestaurants) => {
            const currentData =
              JSON.stringify(
                currentRestaurants
              );

            const newData =
              JSON.stringify(data);

            if (currentData === newData) {
              return currentRestaurants;
            }

            return data;
          }
        );
      } catch (error) {
        console.error(
          "Error fetching restaurants:",
          error
        );
      }
    };

    fetchRestaurants();

    const interval = setInterval(
      fetchRestaurants,
      5000
    );

    return () =>
      clearInterval(interval);
  }, [user]);

  const fetchMyOrders = useCallback(
    async () => {
      if (!user) {
        setOrders([]);
        return [];
      }

      try {
        const token =
          localStorage.getItem(
            "golocal-token"
          );

        if (!token) {
          setOrders([]);
          return [];
        }

        const response = await fetch(
          `${API_URL}/api/orders/my`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch orders."
          );
        }

        const normalizedOrders =
          data
            .map((order) =>
              normalizeOrder(
                order,
                restaurants
              )
            )
            .filter(Boolean);

        setOrders(normalizedOrders);

        return normalizedOrders;
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );

        return [];
      }
    },
    [user, restaurants]
  );

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    fetchMyOrders();

    const interval = setInterval(
      fetchMyOrders,
      5000
    );

    return () =>
      clearInterval(interval);
  }, [user, fetchMyOrders]);

  useEffect(() => {
    localStorage.setItem(
      "golocal-saved",
      JSON.stringify(saved)
    );
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(
      "golocal-orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowRegister(false);
    setTab("explore");

    localStorage.setItem(
      "golocal-active-tab",
      "explore"
    );
  };

  const handleRegister = (
    registeredUser
  ) => {
    setUser(registeredUser);
    setShowRegister(false);
    setTab("explore");

    localStorage.setItem(
      "golocal-active-tab",
      "explore"
    );
  };

  const handleUserUpdate = (
    updatedUser
  ) => {
    setUser(updatedUser);

    localStorage.setItem(
      "golocal-user",
      JSON.stringify(updatedUser)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "golocal-token"
    );

    localStorage.removeItem(
      "golocal-user"
    );

    localStorage.setItem(
      "golocal-active-tab",
      "explore"
    );

    setUser(null);
    setOrders([]);
    setShowRegister(false);
    setSelectedPlace(null);
    setCardPosition(null);
    setOrderPlace(null);
    setTab("explore");
  };

  const addNotification = (message) => {
    const notification = {
      id: Date.now(),
      message,
    };

    setNotifications((current) => [
      notification,
      ...current,
    ]);
  };

  const closeDeliveryPopup = () => {
    setPopupVisible(false);

    setTimeout(() => {
      setDeliveryPopup(null);
    }, 200);
  };

  const showDeliveryPopup = (place) => {
    setDeliveryPopup(place);
    setPopupVisible(true);
  };

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const toggleSaved = (place) => {
    setSaved((currentSaved) => {
      const exists = currentSaved.some(
        (item) => item.id === place.id
      );

      if (exists) {
        return currentSaved.filter(
          (item) => item.id !== place.id
        );
      }

      return [
        ...currentSaved,
        place,
      ];
    });
  };

  const handlePlaceSelect = useCallback(
    (place) => {
      if (!place) {
        return;
      }

      const latitude = Number(
        place.latitude ??
          place.lat
      );

      const longitude = Number(
        place.longitude ??
          place.lng
      );

      const hasCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude);

      const normalizedPlace = {
        ...place,
        coordinates:
          place.coordinates ||
          (hasCoordinates
            ? [
                longitude,
                latitude,
              ]
            : undefined),
        category:
          place.category || "Food",
      };

      setSelectedPlace(
        normalizedPlace
      );

      if (normalizedPlace.category) {
        setCategory(
          normalizedPlace.category
        );
      }

      setTab("explore");
    },
    []
  );

  const handleCardPositionChange =
    useCallback((nextPosition) => {
      setCardPosition(nextPosition);
    }, []);

  const handleClosePlaceCard = () => {
    setSelectedPlace(null);
    setCardPosition(null);

    setResetMap((current) =>
      current + 1
    );
  };

  const handleOrder = (place) => {
    setOrderPlace(place);
  };

  const createOrder = async (
    place,
    quantity = 1
  ) => {
    try {
      const token =
        localStorage.getItem(
          "golocal-token"
        );

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      const price =
        Number(place.price) || 99;

      const deliveryFee = 49;

      const subtotal =
        price * quantity;

      const total =
        subtotal + deliveryFee;

      const itemName =
        place.item ||
        "Food order";

      const items = [
        {
          name: itemName,
          quantity,
          price,
        },
      ];

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            restaurantId:
              place.id,
            restaurantName:
              place.name,
            items,
            total,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create order."
        );
      }

      setOrderPlace(null);

      await fetchMyOrders();

      setTab("orders");

      addNotification(
        `Order placed at ${place.name}.`
      );

      return data.order;
    } catch (error) {
      console.error(
        "Error creating order:",
        error
      );

      addNotification(
        error.message ||
          "Failed to place order."
      );

      return null;
    }
  };

  const removeOrder = async (
    orderId
  ) => {
    try {
      const token =
        localStorage.getItem(
          "golocal-token"
        );

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove order."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) =>
            order.id !== orderId
        )
      );
    } catch (error) {
      console.error(
        "Error removing order:",
        error
      );

      addNotification(
        error.message ||
          "Failed to remove order."
      );
    }
  };

  const searchResults = restaurants
    .filter((restaurant) => {
      if (!search.trim()) {
        return true;
      }

      return restaurant.name
        ?.toLowerCase()
        .includes(
          search
            .trim()
            .toLowerCase()
        );
    })
    .slice(0, 10);

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() =>
            setShowRegister(false)
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() =>
          setShowRegister(true)
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div
        className={
          tab === "explore"
            ? "absolute inset-0"
            : "pointer-events-none absolute inset-0 opacity-0"
        }
      >
        <MapView
          category={category}
          selectedPlace={
            selectedPlace
          }
          onPlaceSelect={
            handlePlaceSelect
          }
          position={position}
          setPosition={setPosition}
          cardPosition={
            cardPosition
          }
          onCardPositionChange={
            handleCardPositionChange
          }
          resetMap={resetMap}
          restaurants={
            restaurants
          }
          darkMode={darkMode}
          isVisible={
            tab === "explore"
          }
        />

        <div className="absolute left-0 right-0 top-0 z-40">
          <Header
            notifications={
              notifications
            }
            onNotifications={() =>
              setNotifications([])
            }
            onProfile={() =>
              setTab("profile")
            }
            darkMode={darkMode}
            onToggleDarkMode={
              toggleDarkMode
            }
          />

          <SearchBar
            search={search}
            setSearch={setSearch}
            results={
              searchResults
            }
            onSelectPlace={
              handlePlaceSelect
            }
          />

          <CategoryBar
            category={category}
            setCategory={setCategory}
          />
        </div>

        {selectedPlace &&
          cardPosition && (
            <PlaceCard
              place={selectedPlace}
              position={cardPosition}
              isSaved={saved.some(
                (item) =>
                  item.id ===
                  selectedPlace.id
              )}
              onSave={() =>
                toggleSaved(
                  selectedPlace
                )
              }
              onOrder={() =>
                handleOrder(
                  selectedPlace
                )
              }
              onClose={
                handleClosePlaceCard
              }
            />
          )}
      </div>

      {orderPlace && (
        <OrderPanel
          place={orderPlace}
          onClose={() =>
            setOrderPlace(null)
          }
          onOrder={createOrder}
        />
      )}

      {tab === "orders" && (
        <Orders
          orders={orders}
          onRemove={removeOrder}
        />
      )}

      {tab === "saved" && (
        <Saved
          places={saved}
          onRemove={(place) =>
            toggleSaved(place)
          }
          onSelect={
            handlePlaceSelect
          }
          onExplore={() =>
            setTab("explore")
          }
        />
      )}

      {tab === "profile" && (
        <Profile
          user={user}
          savedCount={saved.length}
          orderCount={orders.length}
          onSaved={() =>
            setTab("saved")
          }
          onOrders={() =>
            setTab("orders")
          }
          onAdmin={() =>
            setTab("admin")
          }
          onLogout={handleLogout}
          onUserUpdate={
            handleUserUpdate
          }
        />
      )}

      {tab === "admin" && (
        <AdminRestaurants
          restaurants={
            restaurants
          }
          onBack={() =>
            setTab("profile")
          }
        />
      )}

      {tab !== "admin" && (
        <BottomNav
          activeTab={tab}
          setActiveTab={setTab}
        />
      )}

      {deliveryPopup && (
        <div
          className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-4 pb-6 transition-opacity duration-200 ${
            popupVisible
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={
            closeDeliveryPopup
          }
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-gray-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <CheckCircle
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Delivery
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {deliveryPopup.name}
                  </p>
                </div>
              </div>

              <button
                onClick={
                  closeDeliveryPopup
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Your delivery request has been received.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeOrder(
  order,
  restaurants = []
) {
  if (!order) {
    return null;
  }

  let items = [];

  try {
    if (Array.isArray(order.items)) {
      items = order.items;
    } else if (
      typeof order.items === "string"
    ) {
      items =
        JSON.parse(order.items);
    }
  } catch (error) {
    console.error(
      "Failed to parse order items:",
      error
    );

    items = [];
  }

  const firstItem =
    items[0] || {};

  const restaurant =
    restaurants.find(
      (item) =>
        String(item.id) ===
        String(
          order.restaurantId
        )
    );

  const quantity =
    Number(
      firstItem.quantity
    ) || 1;

  const unitPrice =
    Number(
      firstItem.price
    ) || 99;

  const deliveryFee = 49;

  const subtotal =
    unitPrice * quantity;

  const backendTotal =
    Number(order.total);

  return {
    id: order.id,

    placeId:
      order.restaurantId,

    name:
      order.restaurantName ||
      restaurant?.name ||
      "Restaurant",

    category:
      restaurant?.category ||
      "Food",

    logo:
      restaurant?.logo ||
      "",

    item:
      firstItem.name ||
      "Food order",

    quantity,

    unitPrice,

    subtotal,

    deliveryFee,

    total:
      Number.isFinite(
        backendTotal
      )
        ? backendTotal
        : subtotal +
          deliveryFee,

    status:
      order.status ||
      "Placed",

    createdAt:
      order.createdAt,

    address:
      order.address ||
      "",

    restaurantId:
      order.restaurantId,
  };
}

export default App;