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

import chowkingLogo from "../../assets/logos/chowking.png";
import jollibeeLogo from "../../assets/logos/jollibee.png";

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
  category,
  search = "",
  onPlaceSelect,
  selectedPlace,
  position,
  setPosition,
  cardPosition,
  onCardPositionChange,
  resetMap,
  restaurants = [],
  darkMode = false,
  isVisible = true,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const cleanupTimer = useRef(null);
  const userMarker = useRef(null);

  const [isAwayFromCenter, setIsAwayFromCenter] =
    useState(false);

  useEffect(() => {
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }

    if (!mapContainer.current || map.current) {
      return;
    }

    maptilersdk.config.apiKey =
      "0Ou1wc3v64cLkxstebAo";

    const mapInstance =
      new maptilersdk.Map({
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

    map.current = mapInstance;

    const checkMapPosition = () => {
      if (!map.current) {
        return;
      }

      const center =
        map.current.getCenter();

      const zoom =
        map.current.getZoom();

      const longitudeDifference =
        Math.abs(
          center.lng -
            ORIGINAL_CENTER[0]
        );

      const latitudeDifference =
        Math.abs(
          center.lat -
            ORIGINAL_CENTER[1]
        );

      const zoomDifference =
        Math.abs(
          zoom -
            ORIGINAL_ZOOM
        );

      const moved =
        longitudeDifference > 0.002 ||
        latitudeDifference > 0.002 ||
        zoomDifference > 0.15;

      setIsAwayFromCenter(moved);
    };

    mapInstance.on(
      "move",
      checkMapPosition
    );

    mapInstance.on(
      "zoom",
      checkMapPosition
    );

    mapInstance.on(
      "moveend",
      checkMapPosition
    );

    mapInstance.on("load", () => {
      if (!map.current) {
        return;
      }

      map.current.resize();
      checkMapPosition();

      if (position) {
        updateUserMarker(position);
      }
    });

    return () => {
      cleanupTimer.current = setTimeout(() => {
        if (map.current !== mapInstance) {
          return;
        }

        markers.current.forEach(
          (item) => {
            try {
              item.marker.remove();
            } catch {
              // Marker already removed.
            }
          }
        );

        markers.current = [];

        if (userMarker.current) {
          try {
            userMarker.current.remove();
          } catch {
            // User marker already removed.
          }

          userMarker.current = null;
        }

        map.current = null;

        try {
          mapInstance.remove();
        } catch {
          // Map may already have been removed.
        }

        cleanupTimer.current = null;
      }, 0);
    };
  }, []);

  const updateUserMarker = (coordinates) => {
    if (
      !map.current ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return;
    }

    if (userMarker.current) {
      try {
        userMarker.current.setLngLat(
          coordinates
        );
        return;
      } catch {
        try {
          userMarker.current.remove();
        } catch {
          // Marker already removed.
        }

        userMarker.current = null;
      }
    }

    const markerElement =
      document.createElement("div");

    markerElement.innerHTML = `
      <div
        style="
          position: relative;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #3b82f6;
          border: 4px solid white;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.30),
            0 0 0 7px rgba(59,130,246,0.20);
        "
      >
        <div
          style="
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border: 2px solid rgba(59,130,246,0.45);
            animation: golocal-location-pulse 1.8s ease-out infinite;
          "
        ></div>
      </div>
    `;

    if (
      !document.getElementById(
        "golocal-location-marker-style"
      )
    ) {
      const style =
        document.createElement("style");

      style.id =
        "golocal-location-marker-style";

      style.textContent = `
        @keyframes golocal-location-pulse {
          0% {
            transform: scale(0.65);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.25);
            opacity: 0;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
      `;

      document.head.appendChild(style);
    }

    userMarker.current =
      new maptilersdk.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat(coordinates)
        .addTo(map.current);
  };

  useEffect(() => {
    if (!isVisible || !map.current) {
      return;
    }

    const resizeMap = () => {
      if (map.current) {
        try {
          map.current.resize();
        } catch {
          // Map may be transitioning.
        }
      }
    };

    const firstTimer = setTimeout(
      resizeMap,
      0
    );

    const secondTimer = setTimeout(
      resizeMap,
      150
    );

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [isVisible]);

  useEffect(() => {
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }

    if (!map.current) {
      return;
    }

    const newStyle = darkMode
      ? DARK_MAP_STYLE
      : LIGHT_MAP_STYLE;

    try {
      map.current.setStyle(
        newStyle
      );

      map.current.once(
        "styledata",
        () => {
          if (map.current) {
            map.current.resize();

            if (position) {
              updateUserMarker(position);
            }
          }
        }
      );
    } catch (error) {
      console.error(
        "Failed to change map style:",
        error
      );
    }
  }, [darkMode]);

  useEffect(() => {
    if (!map.current || !resetMap) {
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
    if (
      !map.current ||
      !selectedPlace ||
      !selectedPlace.coordinates
    ) {
      return;
    }

    map.current.flyTo({
      center:
        selectedPlace.coordinates,
      zoom: PLACE_ZOOM,
      duration: 1000,
      essential: true,
    });
  }, [selectedPlace]);

  useEffect(() => {
    if (
      !map.current ||
      !selectedPlace ||
      !selectedPlace.coordinates ||
      !onCardPositionChange
    ) {
      return;
    }

    const updateCardPosition = () => {
      if (
        !map.current ||
        !selectedPlace?.coordinates
      ) {
        return;
      }

      try {
        const projected =
          map.current.project(
            selectedPlace.coordinates
          );

        onCardPositionChange({
          x: projected.x,
          y: projected.y,
        });
      } catch {
        // Map may not be ready yet.
      }
    };

    updateCardPosition();

    map.current.on(
      "move",
      updateCardPosition
    );

    map.current.on(
      "resize",
      updateCardPosition
    );

    return () => {
      if (!map.current) {
        return;
      }

      map.current.off(
        "move",
        updateCardPosition
      );

      map.current.off(
        "resize",
        updateCardPosition
      );
    };
  }, [
    selectedPlace,
    onCardPositionChange,
  ]);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    markers.current.forEach(
      (item) => {
        try {
          item.marker.remove();
        } catch {
          // Marker already removed.
        }
      }
    );

    markers.current = [];

    const normalizedSearch =
      search.trim().toLowerCase();

    let places = Array.isArray(
      restaurants
    )
      ? [...restaurants]
      : [];

    places = places
      .map((restaurant) => {
        const latitude = Number(
          restaurant.latitude ??
            restaurant.lat
        );

        const longitude = Number(
          restaurant.longitude ??
            restaurant.lng
        );

        let logo =
          restaurant.logo || null;

        if (
          restaurant.name ===
          "Jollibee"
        ) {
          logo = jollibeeLogo;
        }

        if (
          restaurant.name ===
          "Chowking"
        ) {
          logo = chowkingLogo;
        }

        return {
          ...restaurant,
          coordinates: [
            longitude,
            latitude,
          ],
          logo,
          category:
            restaurant.category ||
            "Food",
          rating:
            restaurant.rating || 0,
          description:
            restaurant.description ||
            "",
        };
      })
      .filter(
        (place) =>
          Number.isFinite(
            place.coordinates[0]
          ) &&
          Number.isFinite(
            place.coordinates[1]
          )
      );

    if (normalizedSearch) {
      places = places.filter(
        (place) =>
          place.name
            ?.toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          place.description
            ?.toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    } else {
      places = places.filter(
        (place) =>
          place.category ===
          category
      );
    }

    places.forEach((place) => {
      const activeCategory =
        place.category || category;

      const Icon =
        categoryIcons[
          activeCategory
        ];

      const colors =
        categoryColors[
          activeCategory
        ];

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
        document.createElement(
          "div"
        );

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

      if (!circle) {
        return;
      }

      circle.animate(
        [
          {
            transform:
              "translateY(-20px)",
            opacity: 0,
          },
          {
            transform:
              "translateY(2px)",
            opacity: 1,
          },
          {
            transform:
              "translateY(-7px)",
          },
          {
            transform:
              "translateY(1px)",
          },
          {
            transform:
              "translateY(-3px)",
          },
          {
            transform:
              "translateY(0)",
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
            selectedPlace?.id ===
            place.id;

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
            category:
              activeCategory,
          };

          onPlaceSelect(
            placeWithCategory
          );
        }
      );

      const marker =
        new maptilersdk.Marker({
          element:
            markerElement,
          anchor: "bottom",
        })
          .setLngLat(
            place.coordinates
          )
          .addTo(map.current);

      markers.current.push({
        marker,
        place,
        circle,
        category:
          activeCategory,
      });
    });

    return () => {
      markers.current.forEach(
        (item) => {
          try {
            item.marker.remove();
          } catch {
            // Marker already removed.
          }
        }
      );

      markers.current = [];
    };
  }, [
    category,
    search,
    restaurants,
    onPlaceSelect,
  ]);

  useEffect(() => {
    markers.current.forEach(
      (item) => {
        const {
          place,
          circle,
          category:
            markerCategory,
        } = item;

        const isSelected =
          selectedPlace?.id ===
          place.id;

        const colors =
          categoryColors[
            markerCategory
          ];

        if (!colors || !circle) {
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

            if (!selectedCircle) {
              return;
            }

            const selectedPulse =
              document.createElement(
                "div"
              );

            selectedPulse.className =
              "marker-selection-pulse";

            selectedPulse.style.position =
              "absolute";

            selectedPulse.style.inset =
              "-8px";

            selectedPulse.style.borderRadius =
              "50%";

            selectedPulse.style.border =
              `2px solid ${colors.border}`;

            selectedPulse.style.pointerEvents =
              "none";

            selectedPulse.style.opacity =
              "0";

            selectedCircle.appendChild(
              selectedPulse
            );

            selectedPulse.animate(
              [
                {
                  transform:
                    "scale(0.82)",
                  opacity: 0.7,
                },
                {
                  transform:
                    "scale(1.2)",
                  opacity: 0,
                },
              ],
              {
                duration: 1500,
                iterations:
                  Infinity,
                easing:
                  "ease-out",
              }
            );

            return;
          }

          const Icon =
            categoryIcons[
              markerCategory
            ];

          if (Icon) {
            circle.innerHTML =
              renderToStaticMarkup(
                <Icon
                  size={23}
                  strokeWidth={2.4}
                />
              );
          }

          circle.style.width =
            "52px";

          circle.style.height =
            "52px";

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
            document.createElement(
              "div"
            );

          selectedPulse.className =
            "marker-selection-pulse";

          selectedPulse.style.position =
            "absolute";

          selectedPulse.style.inset =
            "-8px";

          selectedPulse.style.borderRadius =
            "50%";

          selectedPulse.style.border =
            `2px solid ${colors.border}`;

          selectedPulse.style.pointerEvents =
            "none";

          selectedPulse.style.opacity =
            "0";

          circle.appendChild(
            selectedPulse
          );

          selectedPulse.animate(
            [
              {
                transform:
                  "scale(0.82)",
                opacity: 0.7,
              },
              {
                transform:
                  "scale(1.2)",
                opacity: 0,
              },
            ],
            {
              duration: 1500,
              iterations:
                Infinity,
              easing: "ease-out",
            }
          );

          return;
        }

        const Icon =
          categoryIcons[
            markerCategory
          ];

        if (Icon) {
          circle.innerHTML =
            renderToStaticMarkup(
              <Icon
                size={21}
                strokeWidth={2.3}
              />
            );
        }

        circle.style.width =
          "44px";

        circle.style.height =
          "44px";

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
      }
    );
  }, [selectedPlace]);

  useEffect(() => {
    if (!position || !map.current) {
      return;
    }

    updateUserMarker(position);
  }, [position]);

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
      (currentPosition) => {
        const {
          longitude,
          latitude,
        } = currentPosition.coords;

        const userCoordinates = [
          longitude,
          latitude,
        ];

        if (setPosition) {
          setPosition(
            userCoordinates
          );
        }

        updateUserMarker(
          userCoordinates
        );

        map.current?.flyTo({
          center:
            userCoordinates,
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
    </div>
  );
}

export default MapView;