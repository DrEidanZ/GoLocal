import { useEffect, useRef, useState } from "react";

import {
  LocateFixed,
  Plus,
  Minus,
  Utensils,
  Hotel,
  Package,
  Car,
  Navigation,
} from "lucide-react";

import { renderToStaticMarkup } from "react-dom/server";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

import PlaceCard from "../places/PlaceCard";

import chowkingLogo from "../../assets/logos/chowking.png";
import jollibeeLogo from "../../assets/logos/jollibee.png";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

const ORIGINAL_CENTER = [
  123.8854,
  10.3157,
];

const ORIGINAL_ZOOM = 13;
const PLACE_ZOOM = 16;

const LIGHT_MAP_STYLE =
  "https://api.maptiler.com/maps/streets-v2/style.json";

const DARK_MAP_STYLE =
  "https://api.maptiler.com/maps/streets-v2-dark/style.json";

const categoryIcons = {
  Food: Utensils,
  Hotels: Hotel,
  Delivery: Package,
  Rides: Car,
};

const categoryColors = {
  Food: {
    border: "#f97316",
    text: "#f97316",
    background: "#fff7ed",
  },
  Hotels: {
    border: "#8b5cf6",
    text: "#8b5cf6",
    background: "#f5f3ff",
  },
  Delivery: {
    border: "#22c55e",
    text: "#22c55e",
    background: "#f0fdf4",
  },
  Rides: {
    border: "#3b82f6",
    text: "#3b82f6",
    background: "#eff6ff",
  },
};

function MapView({
  selectedCategory,
  searchText,
  onPlaceSelect,
  selectedPlace,
  onPlacePositionChange,
  onClosePlace,
  onSavePlace,
  isSaved = false,
  resetMap,
  darkMode = false,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const [isAwayFromCenter, setIsAwayFromCenter] =
    useState(false);

  const [databaseRestaurants, setDatabaseRestaurants] =
    useState([]);

  const loadRestaurants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/restaurants`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch restaurants."
        );
      }

      const restaurants = await response.json();

      const formattedRestaurants =
        restaurants.map((restaurant) => {
          let logo = restaurant.logo || null;

          if (restaurant.name === "Jollibee") {
            logo = jollibeeLogo;
          }

          if (restaurant.name === "Chowking") {
            logo = chowkingLogo;
          }

          return {
            id: restaurant.id,
            name: restaurant.name,
            coordinates: [
              Number(restaurant.longitude),
              Number(restaurant.latitude),
            ],
            rating: restaurant.rating || 0,
            description:
              restaurant.description || "",
            logo,
            category:
              restaurant.category || "Food",
          };
        });

      setDatabaseRestaurants(
        formattedRestaurants
      );
    } catch (error) {
      console.error(
        "Error loading restaurants:",
        error
      );
    }
  };

  useEffect(() => {
    loadRestaurants();

    const interval = setInterval(
      loadRestaurants,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updatePlacePosition = () => {
    if (!map.current || !selectedPlace) {
      return;
    }

    const point = map.current.project(
      selectedPlace.coordinates
    );

    onPlacePositionChange({
      x: point.x,
      y: point.y,
    });
  };

  const checkMapPosition = () => {
    if (!map.current) {
      return;
    }

    const center = map.current.getCenter();
    const zoom = map.current.getZoom();

    const longitudeDifference = Math.abs(
      center.lng - ORIGINAL_CENTER[0]
    );

    const latitudeDifference = Math.abs(
      center.lat - ORIGINAL_CENTER[1]
    );

    const zoomDifference = Math.abs(
      zoom - ORIGINAL_ZOOM
    );

    const moved =
      longitudeDifference > 0.002 ||
      latitudeDifference > 0.002 ||
      zoomDifference > 0.15;

    setIsAwayFromCenter(moved);
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) {
      return;
    }

    maptilersdk.config.apiKey =
      "0Ou1wc3v64cLkxstebAo";

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: darkMode
        ? DARK_MAP_STYLE
        : LIGHT_MAP_STYLE,
      center: ORIGINAL_CENTER,
      zoom: ORIGINAL_ZOOM,
      navigationControl: false,
      geolocateControl: false,
      fullscreenControl: false,
      scaleControl: false,
    });

    map.current.on(
      "move",
      checkMapPosition
    );

    map.current.on(
      "zoom",
      checkMapPosition
    );

    map.current.on(
      "moveend",
      checkMapPosition
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    const newStyle = darkMode
      ? DARK_MAP_STYLE
      : LIGHT_MAP_STYLE;

    map.current.setStyle(newStyle);
  }, [darkMode]);

  useEffect(() => {
    if (!map.current || resetMap === 0) {
      return;
    }

    map.current.flyTo({
      center: ORIGINAL_CENTER,
      zoom: ORIGINAL_ZOOM,
      duration: 1000,
      essential: true,
    });

    setIsAwayFromCenter(false);
  }, [resetMap]);

  useEffect(() => {
    if (!map.current || !selectedPlace) {
      return;
    }

    map.current.flyTo({
      center: selectedPlace.coordinates,
      zoom: PLACE_ZOOM,
      duration: 1000,
      essential: true,
    });
  }, [selectedPlace]);

  useEffect(() => {
    if (!map.current || !selectedPlace) {
      return;
    }

    updatePlacePosition();

    const handleMove = () => {
      updatePlacePosition();
    };

    map.current.on("move", handleMove);
    map.current.on("resize", handleMove);

    return () => {
      map.current?.off("move", handleMove);
      map.current?.off("resize", handleMove);
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (!map.current || !selectedCategory) {
      return;
    }

    markers.current.forEach((item) => {
      item.marker.remove();
    });

    markers.current = [];

    const search = searchText
      .trim()
      .toLowerCase();

    let places = [];

    if (search) {
      places = databaseRestaurants.filter(
        (place) =>
          place.name
            .toLowerCase()
            .includes(search) ||
          place.description
            .toLowerCase()
            .includes(search)
      );
    } else {
      places = databaseRestaurants.filter(
        (place) =>
          place.category ===
          selectedCategory
      );
    }

    places.forEach((place) => {
      const activeCategory =
        place.category || selectedCategory;

      const Icon =
        categoryIcons[activeCategory];

      const colors =
        categoryColors[activeCategory];

      if (!Icon || !colors) {
        return;
      }

      const iconMarkup =
        renderToStaticMarkup(
          <Icon
            size={21}
            strokeWidth={2.3}
          />
        );

      const markerElement =
        document.createElement("div");

      markerElement.innerHTML = `
        <div
          style="
            position: relative;
            width: 44px;
            height: 44px;
            background: ${colors.background};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 4px 12px rgba(0,0,0,0.22),
              0 2px 4px rgba(0,0,0,0.12);
            border: 3px solid ${colors.border};
            color: ${colors.text};
            cursor: pointer;
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;
          "
        >
          ${iconMarkup}
        </div>
      `;

      const circle =
        markerElement.firstElementChild;

      circle.animate(
        [
          {
            transform: "translateY(-20px)",
            opacity: 0,
          },
          {
            transform: "translateY(2px)",
            opacity: 1,
          },
          {
            transform: "translateY(-7px)",
          },
          {
            transform: "translateY(1px)",
          },
          {
            transform: "translateY(-3px)",
          },
          {
            transform: "translateY(0)",
          },
        ],
        {
          duration: 1200,
          easing:
            "cubic-bezier(0.22, 1, 0.36, 1)",
        }
      );

      markerElement.addEventListener(
        "mouseenter",
        () => {
          circle.style.transform =
            "scale(1.15)";

          circle.style.boxShadow =
            "0 7px 18px rgba(0,0,0,0.28)";
        }
      );

      markerElement.addEventListener(
        "mouseleave",
        () => {
          const isSelected =
            selectedPlace?.id === place.id;

          if (!isSelected) {
            circle.style.transform =
              "scale(1)";

            circle.style.boxShadow =
              "0 4px 12px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12)";
          }
        }
      );

      markerElement.addEventListener(
        "click",
        () => {
          const placeWithCategory = {
            ...place,
            category: activeCategory,
          };

          onPlaceSelect(
            placeWithCategory
          );

          map.current?.flyTo({
            center: place.coordinates,
            zoom: PLACE_ZOOM,
            duration: 1000,
            essential: true,
          });
        }
      );

      const marker =
        new maptilersdk.Marker({
          element: markerElement,
          anchor: "bottom",
        })
          .setLngLat(place.coordinates)
          .addTo(map.current);

      markers.current.push({
        marker,
        place,
        circle,
        category: activeCategory,
      });
    });

    return () => {
      markers.current.forEach((item) => {
        item.marker.remove();
      });

      markers.current = [];
    };
  }, [
    selectedCategory,
    searchText,
    onPlaceSelect,
    databaseRestaurants,
  ]);

  useEffect(() => {
    markers.current.forEach((item) => {
      const {
        place,
        circle,
        category,
      } = item;

      const isSelected =
        selectedPlace?.id === place.id;

      const colors =
        categoryColors[category];

      if (!colors) {
        return;
      }

      const existingPulse =
        circle.querySelector(
          ".marker-selection-pulse"
        );

      if (existingPulse) {
        existingPulse.remove();
      }

      if (isSelected) {
        if (place.logo) {
          circle.innerHTML = `
            <div
              style="
                position: relative;
                width: 52px;
                height: 52px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid ${colors.border};
                box-shadow:
                  0 7px 20px rgba(0,0,0,0.30),
                  0 0 0 5px ${colors.border}22;
                transform: scale(1.12);
              "
            >
              <img
                src="${place.logo}"
                alt="${place.name}"
                style="
                  width: 36px;
                  height: 36px;
                  object-fit: contain;
                "
              />
            </div>
          `;

          const selectedCircle =
            circle.firstElementChild;

          const selectedPulse =
            document.createElement("div");

          selectedPulse.className =
            "marker-selection-pulse";

          selectedPulse.style.position =
            "absolute";
          selectedPulse.style.inset = "-8px";
          selectedPulse.style.borderRadius =
            "50%";
          selectedPulse.style.border =
            `2px solid ${colors.border}`;
          selectedPulse.style.pointerEvents =
            "none";
          selectedPulse.style.opacity = "0";

          selectedCircle.appendChild(
            selectedPulse
          );

          selectedPulse.animate(
            [
              {
                transform: "scale(0.82)",
                opacity: 0.7,
              },
              {
                transform: "scale(1.2)",
                opacity: 0,
              },
            ],
            {
              duration: 1500,
              iterations: Infinity,
              easing: "ease-out",
            }
          );

          return;
        }

        const Icon =
          categoryIcons[category];

        if (Icon) {
          circle.innerHTML =
            renderToStaticMarkup(
              <Icon
                size={23}
                strokeWidth={2.4}
              />
            );
        }

        circle.style.width = "52px";
        circle.style.height = "52px";
        circle.style.background =
          colors.background;
        circle.style.border =
          `3px solid ${colors.border}`;
        circle.style.color =
          colors.text;
        circle.style.transform =
          "scale(1.12)";
        circle.style.boxShadow =
          `0 7px 20px rgba(0,0,0,0.30), 0 0 0 5px ${colors.border}22`;

        const selectedPulse =
          document.createElement("div");

        selectedPulse.className =
          "marker-selection-pulse";

        selectedPulse.style.position =
          "absolute";
        selectedPulse.style.inset = "-8px";
        selectedPulse.style.borderRadius =
          "50%";
        selectedPulse.style.border =
          `2px solid ${colors.border}`;
        selectedPulse.style.pointerEvents =
          "none";
        selectedPulse.style.opacity = "0";

        circle.appendChild(
          selectedPulse
        );

        selectedPulse.animate(
          [
            {
              transform: "scale(0.82)",
              opacity: 0.7,
            },
            {
              transform: "scale(1.2)",
              opacity: 0,
            },
          ],
          {
            duration: 1500,
            iterations: Infinity,
            easing: "ease-out",
          }
        );

        return;
      }

      const Icon =
        categoryIcons[category];

      if (Icon) {
        circle.innerHTML =
          renderToStaticMarkup(
            <Icon
              size={21}
              strokeWidth={2.3}
            />
          );
      }

      circle.style.width = "44px";
      circle.style.height = "44px";
      circle.style.background =
        colors.background;
      circle.style.border =
        `3px solid ${colors.border}`;
      circle.style.color =
        colors.text;
      circle.style.transform =
        "scale(1)";
      circle.style.boxShadow =
        "0 4px 12px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12)";
    });
  }, [
    selectedPlace,
    selectedCategory,
  ]);

  const zoomIn = () => {
    if (!map.current) {
      return;
    }

    map.current.zoomIn({
      duration: 250,
    });
  };

  const zoomOut = () => {
    if (!map.current) {
      return;
    }

    map.current.zoomOut({
      duration: 250,
    });
  };

  const recenterMap = () => {
    if (!map.current) {
      return;
    }

    map.current.flyTo({
      center: ORIGINAL_CENTER,
      zoom: ORIGINAL_ZOOM,
      duration: 700,
      essential: true,
    });

    setIsAwayFromCenter(false);
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert(
        "Your device does not support location services."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          longitude,
          latitude,
        } = position.coords;

        map.current?.flyTo({
          center: [
            longitude,
            latitude,
          ],
          zoom: 16,
          duration: 1000,
          essential: true,
        });
      },
      (error) => {
        console.log(
          "Location error:",
          error
        );

        if (error.code === 1) {
          alert(
            "Please allow GoLocal to access your location."
          );
        } else {
          alert(
            "We couldn't get your location. Please try again."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="absolute inset-0 h-full w-full">
      <div
        ref={mapContainer}
        className="absolute inset-0 h-full w-full"
      />

      <div
        className="
          absolute
          bottom-[225px]
          right-4
          z-[30]
          flex
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-100
          bg-white
          shadow-lg
          dark:border-gray-700
          dark:bg-gray-900
          sm:bottom-40
        "
      >
        <button
          onClick={zoomIn}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            text-gray-700
            transition-all
            duration-150
            hover:bg-gray-50
            hover:text-blue-500
            active:scale-90
            dark:text-gray-200
            dark:hover:bg-gray-800
            dark:hover:text-blue-400
          "
          aria-label="Zoom in"
        >
          <Plus
            size={21}
            strokeWidth={2.2}
          />
        </button>

        <div className="mx-2 border-t border-gray-100 dark:border-gray-700" />

        <button
          onClick={zoomOut}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            text-gray-700
            transition-all
            duration-150
            hover:bg-gray-50
            hover:text-blue-500
            active:scale-90
            dark:text-gray-200
            dark:hover:bg-gray-800
            dark:hover:text-blue-400
          "
          aria-label="Zoom out"
        >
          <Minus
            size={21}
            strokeWidth={2.2}
          />
        </button>
      </div>

      <button
        onClick={recenterMap}
        className={`
          absolute
          bottom-[155px]
          left-4
          z-[30]
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-gray-100
          bg-white
          text-gray-700
          shadow-lg
          transition-all
          duration-200
          hover:scale-105
          hover:text-blue-500
          hover:shadow-xl
          active:scale-90
          active:shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
          dark:text-gray-200
          sm:bottom-28
          ${
            isAwayFromCenter
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }
        `}
        aria-label="Recenter map"
      >
        <Navigation
          size={21}
          strokeWidth={2.2}
        />
      </button>

      <button
        onClick={locateUser}
        className="
          absolute
          bottom-[155px]
          right-4
          z-[30]
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-gray-100
          bg-white
          text-gray-700
          shadow-lg
          transition-all
          duration-200
          hover:scale-105
          hover:text-blue-500
          hover:shadow-xl
          active:scale-90
          active:shadow-sm
          dark:border-gray-700
          dark:bg-gray-900
          dark:text-gray-200
          sm:bottom-28
        "
        aria-label="Locate me"
      >
        <LocateFixed
          size={22}
          strokeWidth={2.2}
        />
      </button>

      <PlaceCard
        place={selectedPlace}
        position={
          selectedPlace
            ? {
                x: 0,
                y: 0,
              }
            : null
        }
        isSaved={isSaved}
        onClose={onClosePlace}
        onSave={onSavePlace}
      />
    </div>
  );
}

export default MapView;