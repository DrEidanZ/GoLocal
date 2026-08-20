import { useCallback, useState } from "react";

import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";

import SearchBar from "./components/search/SearchBar";
import CategoryBar from "./components/categories/CategoryBar";

import MapView, {
  categoryPlaces,
} from "./components/map/MapView";

import PlaceCard from "./components/places/PlaceCard";
import OrderPanel from "./components/orders/OrderPanel";

import Profile from "./components/profile/Profile";
import Saved from "./components/profile/Saved";
import Orders from "./components/orders/Orders";

function App() {
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Explore");

  const [place, setPlace] = useState(null);
  const [position, setPosition] = useState(null);

  const [orderPlace, setOrderPlace] = useState(null);

  const [saved, setSaved] = useState([]);
  const [orders, setOrders] = useState([]);

  const [resetMap, setResetMap] = useState(0);

  const results = search.trim()
    ? Object.entries(categoryPlaces)
        .flatMap(([categoryName, places]) =>
          places
            .filter((item) => {
              const text =
                search.trim().toLowerCase();

              return (
                item.name
                  .toLowerCase()
                  .includes(text) ||
                item.description
                  .toLowerCase()
                  .includes(text)
              );
            })
            .map((item) => ({
              ...item,
              category: categoryName,
            }))
        )
        .slice(0, 6)
    : [];

  const selectPlace = useCallback((item) => {
    setPlace(item);
    setTab("Explore");
  }, []);

  const selectSearchResult = useCallback((item) => {
    setCategory(item.category);
    setSearch("");
    setPlace(item);
    setTab("Explore");
  }, []);

  const closePlace = useCallback(() => {
    setPlace(null);
    setPosition(null);
    setSearch("");
    setResetMap((value) => value + 1);
  }, []);

  const toggleSaved = useCallback(() => {
    if (!place) return;

    setSaved((current) => {
      const exists = current.some(
        (item) => item.name === place.name
      );

      if (exists) {
        return current.filter(
          (item) => item.name !== place.name
        );
      }

      return [...current, place];
    });
  }, [place]);

  const removeSavedPlace = useCallback((item) => {
    setSaved((current) =>
      current.filter(
        (place) => place.name !== item.name
      )
    );
  }, []);

  /* OPEN ORDER PANEL */

  const openOrderPanel = useCallback((item) => {
    setOrderPlace(item);
  }, []);

  /* CLOSE ORDER PANEL */

  const closeOrderPanel = useCallback(() => {
    setOrderPlace(null);
  }, []);

  /* CREATE ORDER AFTER CHECKOUT */

  const createOrder = useCallback((order) => {
    const newOrder = {
      id: order.id || Date.now(),
      name: order.place,
      category: order.category || "Food",
      logo: order.logo,
      item: order.item || "Food order",
      price: order.price || "₱99",
      quantity: order.quantity || 1,
      status: order.status || "Preparing",
      statusType: order.statusType || "active",
      time: order.time || "Just now",
      address:
        order.address ||
        "Your delivery address",
    };

    setOrders((current) => [
      newOrder,
      ...current,
    ]);

    setOrderPlace(null);
    setPlace(null);
    setPosition(null);
    setSearch("");
    setTab("Orders");
  }, []);

  const updateOrderQuantity = useCallback(
    (orderId, change) => {
      setOrders((current) =>
        current.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          const newQuantity =
            order.quantity + change;

          return {
            ...order,
            quantity: Math.max(1, newQuantity),
          };
        })
      );
    },
    []
  );

  const removeOrder = useCallback((orderId) => {
    setOrders((current) =>
      current.filter(
        (order) => order.id !== orderId
      )
    );
  }, []);

  const isSaved = place
    ? saved.some(
        (item) => item.name === place.name
      )
    : false;

  const changeTab = useCallback((nextTab) => {
    setTab(nextTab);

    if (nextTab !== "Explore") {
      setPlace(null);
      setPosition(null);
      setSearch("");
      setOrderPlace(null);
    }
  }, []);

  const selectSavedPlace = useCallback((item) => {
    setCategory(item.category);
    setPlace(item);
    setTab("Explore");
  }, []);

  const explore = (
    <div className="absolute inset-0">

      <MapView
        selectedCategory={category}
        searchText={search}
        onPlaceSelect={selectPlace}
        selectedPlace={place}
        onPlacePositionChange={setPosition}
        resetMap={resetMap}
      />

      {/* HEADER */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-10
        "
      >
        <Header />
      </div>

      {/* SEARCH */}

      <div
        className="
          absolute
          left-4
          right-4
          top-20
          z-50
        "
      >
        <SearchBar
          searchText={search}
          setSearchText={setSearch}
          searchResults={results}
          onResultSelect={selectSearchResult}
        />
      </div>

      {/* CATEGORIES */}

      <div
        className="
          absolute
          left-0
          right-0
          top-36
          z-10
        "
      >
        <CategoryBar
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />
      </div>

      {/* PLACE CARD */}

      <PlaceCard
        place={place}
        position={position}
        isSaved={isSaved}
        onClose={closePlace}
        onSave={toggleSaved}
        onOrder={openOrderPanel}
      />

      {/* ORDER PANEL */}

      {orderPlace && (
        <OrderPanel
          place={orderPlace}
          onClose={closeOrderPanel}
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
          changeTab("Explore")
        }
        onSelect={selectSavedPlace}
        onRemove={removeSavedPlace}
      />
    );
  }

  if (tab === "Profile") {
    page = (
      <Profile
        savedCount={saved.length}
        orderCount={orders.length}
        onSaved={() =>
          changeTab("Saved")
        }
        onOrders={() =>
          changeTab("Orders")
        }
      />
    );
  }

  if (tab === "Orders") {
    page = (
      <Orders
        orders={orders}
        onRemove={removeOrder}
        onUpdateQuantity={updateOrderQuantity}
      />
    );
  }

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
      "
    >
      {page}

      <BottomNav
        activeTab={tab}
        setActiveTab={changeTab}
      />
    </div>
  );
}

export default App;