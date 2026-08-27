import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";

import SearchBar from "./components/search/SearchBar";
import CategoryBar from "./components/categories/CategoryBar";

import MapView from "./components/map/MapView";

import PlaceCard from "./components/places/PlaceCard";
import OrderPanel from "./components/orders/OrderPanel";

import Profile from "./components/profile/Profile";
import Saved from "./components/profile/Saved";
import Orders from "./components/orders/Orders";

import AdminRestaurants from "./components/admin/AdminRestaurants";

import {
  CheckCircle,
  X,
} from "lucide-react";

function App() {
  const [category, setCategory] =
    useState("Food");

  const [search, setSearch] =
    useState("");

  const [tab, setTab] =
    useState("Explore");

  const [place, setPlace] =
    useState(null);

  const [position, setPosition] =
    useState(null);

  const [orderPlace, setOrderPlace] =
    useState(null);

  const [restaurants, setRestaurants] =
    useState([]);

  const [saved, setSaved] = useState(() => {
    try {
      const storedSaved =
        localStorage.getItem(
          "golocal-saved"
        );

      return storedSaved
        ? JSON.parse(storedSaved)
        : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] =
    useState(() => {
      try {
        const storedOrders =
          localStorage.getItem(
            "golocal-orders"
          );

        return storedOrders
          ? JSON.parse(storedOrders)
          : [];
      } catch {
        return [];
      }
    });

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
          "golocal-theme"
        ) === "dark"
      );
    });

  const popupTimer = useRef(null);
  const popupFadeTimer = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "golocal-theme",
      darkMode
        ? "dark"
        : "light"
    );
  }, [darkMode]);

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

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/restaurants"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch restaurants."
          );
        }

        const data =
          await response.json();

        const formatted =
          data.map((restaurant) => ({
            id: restaurant.id,
            name: restaurant.name,
            description:
              restaurant.description || "",
            category:
              restaurant.category || "Food",
            coordinates: [
              Number(
                restaurant.longitude
              ),
              Number(
                restaurant.latitude
              ),
            ],
            logo:
              restaurant.logo || "",
            rating:
              restaurant.rating || 0,
          }));

        setRestaurants(formatted);
      } catch (error) {
        console.error(
          "Error loading restaurants:",
          error
        );
      }
    };

    loadRestaurants();

    const interval =
      setInterval(
        loadRestaurants,
        5000
      );

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (popupTimer.current) {
        clearTimeout(
          popupTimer.current
        );
      }

      if (popupFadeTimer.current) {
        clearTimeout(
          popupFadeTimer.current
        );
      }
    };
  }, []);

  const addNotification =
    useCallback(
      (notification) => {
        setNotifications(
          (current) => [
            {
              id:
                Date.now() +
                Math.random(),
              ...notification,
            },
            ...current,
          ]
        );
      },
      []
    );

  const closeDeliveryPopup =
    useCallback(() => {
      setPopupVisible(false);

      if (popupTimer.current) {
        clearTimeout(
          popupTimer.current
        );
      }

      if (popupFadeTimer.current) {
        clearTimeout(
          popupFadeTimer.current
        );
      }

      popupFadeTimer.current =
        setTimeout(() => {
          setDeliveryPopup(null);
        }, 350);
    }, []);

  const showDeliveryPopup =
    useCallback(
      (order) => {
        if (popupTimer.current) {
          clearTimeout(
            popupTimer.current
          );
        }

        if (popupFadeTimer.current) {
          clearTimeout(
            popupFadeTimer.current
          );
        }

        setDeliveryPopup({
          id:
            Date.now() +
            Math.random(),
          name:
            order.name ||
            "Your order",
          item:
            order.item ||
            "Your order",
        });

        setPopupVisible(true);

        popupTimer.current =
          setTimeout(() => {
            setPopupVisible(false);

            popupFadeTimer.current =
              setTimeout(() => {
                setDeliveryPopup(null);
              }, 350);
          }, 4500);
      },
      []
    );

  const toggleDarkMode =
    useCallback(() => {
      setDarkMode(
        (value) => !value
      );
    }, []);

  const results = search.trim()
    ? restaurants
        .filter((item) => {
          const text =
            search
              .trim()
              .toLowerCase();

          return (
            item.name
              .toLowerCase()
              .includes(text) ||
            item.description
              .toLowerCase()
              .includes(text)
          );
        })
        .slice(0, 6)
    : [];

  const selectPlace =
    useCallback(
      (item) => {
        setPlace(item);
        setTab("Explore");
      },
      []
    );

  const selectSearchResult =
    useCallback(
      (item) => {
        setCategory(
          item.category
        );

        setSearch("");

        setPlace(item);

        setTab("Explore");
      },
      []
    );

  const closePlace =
    useCallback(() => {
      setPlace(null);
      setPosition(null);
      setSearch("");

      setResetMap(
        (value) => value + 1
      );
    }, []);

  const toggleSaved =
    useCallback(() => {
      if (!place) return;

      setSaved((current) => {
        const exists =
          current.some(
            (item) =>
              item.name ===
              place.name
          );

        if (exists) {
          addNotification({
            type: "removed",
            title:
              "Removed from saved",
            message: `${place.name} was removed from your saved places.`,
          });

          return current.filter(
            (item) =>
              item.name !==
              place.name
          );
        }

        addNotification({
          type: "saved",
          title: "Place saved",
          message: `${place.name} was added to your saved places.`,
        });

        return [
          ...current,
          place,
        ];
      });
    }, [
      place,
      addNotification,
    ]);

  const removeSavedPlace =
    useCallback(
      (item) => {
        setSaved((current) =>
          current.filter(
            (place) =>
              place.name !==
              item.name
          )
        );

        addNotification({
          type: "removed",
          title:
            "Place removed",
          message: `${item.name} was removed from your saved places.`,
        });
      },
      [addNotification]
    );

  const openOrderPanel =
    useCallback((item) => {
      setOrderPlace(item);
    }, []);

  const closeOrderPanel =
    useCallback(() => {
      setOrderPlace(null);
    }, []);

  const createOrder =
    useCallback(
      (order) => {
        const now =
          Date.now();

        const newOrder = {
          id:
            order.id || now,

          name:
            order.place,

          category:
            order.category ||
            "Food",

          logo:
            order.logo,

          item:
            order.item ||
            "Food order",

          price:
            order.price ||
            "₱99",

          quantity:
            order.quantity ||
            1,

          status:
            "Placed",

          statusType:
            "active",

          time:
            "Just now",

          address:
            order.address ||
            "Your delivery address",

          createdAt:
            now,

          statusChangedAt:
            now,
        };

        setOrders(
          (current) => [
            newOrder,
            ...current,
          ]
        );

        addNotification({
          type: "order",
          title:
            "Order placed",
          message: `${newOrder.name} order has been placed.`,
        });

        setOrderPlace(null);
        setPlace(null);
        setPosition(null);
        setSearch("");
        setTab("Orders");
      },
      [addNotification]
    );

  useEffect(() => {
    const updateOrders =
      () => {
        const now =
          Date.now();

        setOrders(
          (current) => {
            let changed =
              false;

            const updated =
              current.map(
                (order) => {
                  if (
                    order.status ===
                    "Delivered"
                  ) {
                    return order;
                  }

                  const createdAt =
                    order.createdAt ||
                    order.statusChangedAt ||
                    now;

                  const elapsed =
                    now -
                    createdAt;

                  let nextStatus =
                    "Placed";

                  if (
                    elapsed >=
                    17000
                  ) {
                    nextStatus =
                      "Delivered";
                  } else if (
                    elapsed >=
                    9000
                  ) {
                    nextStatus =
                      "On the way";
                  } else if (
                    elapsed >=
                    3000
                  ) {
                    nextStatus =
                      "Preparing";
                  }

                  if (
                    nextStatus ===
                    order.status
                  ) {
                    return order;
                  }

                  changed =
                    true;

                  if (
                    nextStatus ===
                    "Preparing"
                  ) {
                    addNotification({
                      type: "order",
                      title:
                        "Order preparing",
                      message: `${order.name} is now being prepared.`,
                    });
                  }

                  if (
                    nextStatus ===
                    "On the way"
                  ) {
                    addNotification({
                      type: "order",
                      title:
                        "Order on the way",
                      message: `Your ${order.name} order is now on the way.`,
                    });
                  }

                  if (
                    nextStatus ===
                    "Delivered"
                  ) {
                    addNotification({
                      type: "order",
                      title:
                        "Order delivered",
                      message: `Your ${order.name} order has been delivered.`,
                    });

                    setTimeout(
                      () => {
                        showDeliveryPopup(
                          order
                        );
                      },
                      0
                    );
                  }

                  return {
                    ...order,
                    status:
                      nextStatus,
                    statusChangedAt:
                      now,
                    statusType:
                      nextStatus ===
                      "Delivered"
                        ? "completed"
                        : "active",
                  };
                }
              );

            return changed
              ? updated
              : current;
          }
        );
      };

    const interval =
      setInterval(
        updateOrders,
        100
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    addNotification,
    showDeliveryPopup,
  ]);

  const updateOrderQuantity =
    useCallback(
      (
        orderId,
        change
      ) => {
        setOrders(
          (current) =>
            current.map(
              (order) => {
                if (
                  order.id !==
                  orderId
                ) {
                  return order;
                }

                const newQuantity =
                  (order.quantity ||
                    1) +
                  change;

                return {
                  ...order,
                  quantity:
                    Math.max(
                      1,
                      newQuantity
                    ),
                };
              }
            )
        );
      },
      []
    );

  const removeOrder =
    useCallback(
      (orderId) => {
        const order =
          orders.find(
            (item) =>
              item.id ===
              orderId
          );

        setOrders(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                orderId
            )
        );

        if (order) {
          addNotification({
            type: "removed",
            title:
              "Order removed",
            message: `${order.name} was removed from your orders.`,
          });
        }
      },
      [
        orders,
        addNotification,
      ]
    );

  const isSaved = place
    ? saved.some(
        (item) =>
          item.name ===
          place.name
      )
    : false;

  const changeTab =
    useCallback(
      (nextTab) => {
        setTab(nextTab);

        if (
          nextTab !==
          "Explore"
        ) {
          setPlace(null);
          setPosition(null);
          setSearch("");
          setOrderPlace(null);
        }
      },
      []
    );

  const selectSavedPlace =
    useCallback(
      (item) => {
        setCategory(
          item.category
        );

        setPlace(item);

        setTab("Explore");
      },
      []
    );

  const explore = (
    <div className="absolute inset-0 overflow-hidden">
      <MapView
        selectedCategory={
          category
        }
        searchText={search}
        onPlaceSelect={
          selectPlace
        }
        selectedPlace={
          place
        }
        onPlacePositionChange={
          setPosition
        }
        resetMap={resetMap}
        darkMode={darkMode}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="pointer-events-auto">
          <Header
            darkMode={
              darkMode
            }
            onToggleDarkMode={
              toggleDarkMode
            }
            onProfile={() =>
              changeTab(
                "Profile"
              )
            }
            notifications={
              notifications
            }
          />
        </div>
      </div>

      <div className="absolute left-4 right-4 top-[76px] z-40 sm:left-6 sm:right-6">
        <SearchBar
          searchText={search}
          setSearchText={
            setSearch
          }
          searchResults={
            results
          }
          onResultSelect={
            selectSearchResult
          }
        />
      </div>

      <div className="absolute left-0 right-0 top-[136px] z-30">
        <CategoryBar
          selectedCategory={
            category
          }
          setSelectedCategory={
            setCategory
          }
        />
      </div>

      <PlaceCard
        place={place}
        position={position}
        isSaved={isSaved}
        onClose={closePlace}
        onSave={toggleSaved}
        onOrder={
          openOrderPanel
        }
      />

      {orderPlace && (
        <OrderPanel
          place={orderPlace}
          onClose={
            closeOrderPanel
          }
          onAdd={createOrder}
        />
      )}
    </div>
  );

  let page = explore;

  if (tab === "Saved") {
    page = (
      <Saved
        places={saved}
        onExplore={() =>
          changeTab(
            "Explore"
          )
        }
        onSelect={
          selectSavedPlace
        }
        onRemove={
          removeSavedPlace
        }
      />
    );
  }

  if (tab === "Profile") {
    page = (
      <Profile
        savedCount={
          saved.length
        }
        orderCount={
          orders.length
        }
        onSaved={() =>
          changeTab("Saved")
        }
        onOrders={() =>
          changeTab("Orders")
        }
        onAdmin={() =>
          changeTab("Admin")
        }
      />
    );
  }

  if (tab === "Orders") {
    page = (
      <Orders
        orders={orders}
        onRemove={
          removeOrder
        }
        onUpdateStatus={() => {}}
        onUpdateQuantity={
          updateOrderQuantity
        }
      />
    );
  }

  if (tab === "Admin") {
    page = (
      <AdminRestaurants
        onBack={() =>
          changeTab("Profile")
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {page}

      {tab !== "Admin" && (
        <BottomNav
          activeTab={tab}
          setActiveTab={
            changeTab
          }
        />
      )}

      {deliveryPopup && (
        <div
          className={`
            fixed
            bottom-20
            right-4
            z-[9999]
            w-[calc(100%-2rem)]
            max-w-sm
            transition-all
            duration-350
            sm:bottom-5
            sm:right-5
            ${
              popupVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-6 opacity-0"
            }
          `}
        >
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-green-100
              bg-white
              px-4
              py-3.5
              shadow-2xl
              dark:border-green-900/50
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-green-600
                dark:bg-green-950/50
                dark:text-green-400
              "
            >
              <CheckCircle
                size={22}
                strokeWidth={2.5}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Order delivered!
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {deliveryPopup.name}
                {" · "}
                {deliveryPopup.item}
              </p>
            </div>

            <button
              type="button"
              onClick={
                closeDeliveryPopup
              }
              aria-label="Dismiss delivery notification"
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-gray-400
                transition
                duration-200
                hover:bg-gray-100
                hover:text-gray-600
                active:scale-90
                dark:hover:bg-gray-800
                dark:hover:text-gray-200
              "
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;