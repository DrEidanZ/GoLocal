import { useEffect, useRef } from "react";

import {
  LocateFixed,
  Utensils,
  Hotel,
  Package,
  Car,
} from "lucide-react";

import { renderToStaticMarkup } from "react-dom/server";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

import PlaceCard from "../places/PlaceCard";

import chowkingLogo from "../../assets/logos/chowking.png";
import jollibeeLogo from "../../assets/logos/jollibee.png";


const ORIGINAL_CENTER = [
  123.8854,
  10.3157,
];

const ORIGINAL_ZOOM = 13;
const PLACE_ZOOM = 16;


export const categoryPlaces = {
  Food: [
    {
      name: "McDonald's",
      coordinates: [123.8854, 10.3157],
      rating: 4.6,
      description:
        "Burgers, fries, chicken, and more.",
      logo: null,
    },
    {
      name: "Jollibee",
      coordinates: [123.892, 10.32],
      rating: 4.7,
      description:
        "Filipino favorites and fast food.",
      logo: jollibeeLogo,
    },
    {
      name: "Starbucks",
      coordinates: [123.878, 10.31],
      rating: 4.5,
      description:
        "Coffee, pastries, and refreshing drinks.",
      logo: null,
    },
    {
      name: "Mang Inasal",
      coordinates: [123.89, 10.316],
      rating: 4.7,
      description:
        "Chicken inasal, rice meals, and Filipino food.",
      logo: null,
    },
    {
      name: "Chowking",
      coordinates: [123.883, 10.322],
      rating: 4.4,
      description:
        "Chinese-style Filipino fast food.",
      logo: chowkingLogo,
    },
  ],

  Hotels: [
    {
      name: "Cebu Grand Hotel",
      coordinates: [123.89, 10.31],
      rating: 4.5,
      description:
        "Comfortable rooms in the heart of the city.",
      logo: null,
    },
    {
      name: "Harbor View Hotel",
      coordinates: [123.88, 10.32],
      rating: 4.6,
      description:
        "Relaxing accommodation with city views.",
      logo: null,
    },
    {
      name: "City Garden Hotel",
      coordinates: [123.895, 10.315],
      rating: 4.4,
      description:
        "Modern rooms and convenient amenities.",
      logo: null,
    },
    {
      name: "Grand Central Suites",
      coordinates: [123.884, 10.313],
      rating: 4.7,
      description:
        "Stylish suites close to major attractions.",
      logo: null,
    },
  ],

  Delivery: [
    {
      name: "GoLocal Delivery",
      coordinates: [123.885, 10.325],
      rating: 4.8,
      description:
        "Fast and convenient local deliveries.",
      logo: null,
    },
    {
      name: "QuickDrop",
      coordinates: [123.875, 10.315],
      rating: 4.6,
      description:
        "Affordable same-day delivery service.",
      logo: null,
    },
    {
      name: "Dash Express",
      coordinates: [123.9, 10.31],
      rating: 4.7,
      description:
        "Fast delivery around the city.",
      logo: null,
    },
    {
      name: "CitySend",
      coordinates: [123.892, 10.308],
      rating: 4.5,
      description:
        "Local package and document delivery.",
      logo: null,
    },
  ],

  Rides: [
    {
      name: "GoLocal Rides",
      coordinates: [123.882, 10.312],
      rating: 4.9,
      description:
        "Convenient rides around the city.",
      logo: null,
    },
    {
      name: "CityCab",
      coordinates: [123.89, 10.322],
      rating: 4.7,
      description:
        "Reliable city transportation.",
      logo: null,
    },
    {
      name: "QuickRide",
      coordinates: [123.9, 10.32],
      rating: 4.8,
      description:
        "Fast rides whenever you need them.",
      logo: null,
    },
    {
      name: "Metro Transport",
      coordinates: [123.878, 10.318],
      rating: 4.6,
      description:
        "Affordable transportation around Cebu.",
      logo: null,
    },
  ],
};


const categoryIcons = {
  Food: Utensils,
  Hotels: Hotel,
  Delivery: Package,
  Rides: Car,
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
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);


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


  useEffect(() => {
    if (!mapContainer.current || map.current) {
      return;
    }

    maptilersdk.config.apiKey =
      "0Ou1wc3v64cLkxstebAo";

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets-v2/style.json",
      center: ORIGINAL_CENTER,
      zoom: ORIGINAL_ZOOM,
      navigationControl: false,
      geolocateControl: false,
      fullscreenControl: false,
      scaleControl: false,
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);


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
    if (!map.current || resetMap === 0) {
      return;
    }

    map.current.flyTo({
      center: ORIGINAL_CENTER,
      zoom: ORIGINAL_ZOOM,
      duration: 1000,
      essential: true,
    });
  }, [resetMap]);


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
    let activeCategory = selectedCategory;

    if (search) {
      for (const [
        category,
        categoryList,
      ] of Object.entries(categoryPlaces)) {
        const matches = categoryList.filter(
          (place) =>
            place.name
              .toLowerCase()
              .includes(search) ||
            place.description
              .toLowerCase()
              .includes(search)
        );

        if (matches.length > 0) {
          places = matches;
          activeCategory = category;
          break;
        }
      }
    } else {
      places =
        categoryPlaces[selectedCategory] || [];
    }

    const Icon =
      categoryIcons[activeCategory];

    if (!Icon) {
      return;
    }

    const iconMarkup =
      renderToStaticMarkup(
        <Icon
          size={22}
          strokeWidth={2.2}
        />
      );


    places.forEach((place) => {
      const markerElement =
        document.createElement("div");

      markerElement.innerHTML = `
        <div
          style="
            width: 42px;
            height: 42px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px
              rgba(0,0,0,0.25);
            border: 3px solid #3b82f6;
            color: #3b82f6;
            cursor: pointer;
            transition: transform 0.2s ease;
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
        }
      );


      markerElement.addEventListener(
        "mouseleave",
        () => {
          circle.style.transform =
            "scale(1)";
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
  ]);


  useEffect(() => {
    markers.current.forEach((item) => {
      const { place, circle } = item;

      const isSelected =
        selectedPlace?.name === place.name;

      if (isSelected && place.logo) {
        circle.innerHTML = `
          <img
            src="${place.logo}"
            alt="${place.name}"
            style="
              width: 36px;
              height: 36px;
              object-fit: contain;
            "
          />
        `;

        circle.style.width = "50px";
        circle.style.height = "50px";
        circle.style.transform =
          "scale(1.12)";
        circle.style.boxShadow =
          "0 6px 18px rgba(0,0,0,0.30)";

        return;
      }

      if (!isSelected) {
        const Icon =
          categoryIcons[selectedCategory];

        if (Icon) {
          circle.innerHTML =
            renderToStaticMarkup(
              <Icon
                size={22}
                strokeWidth={2.2}
              />
            );
        }
      }

      circle.style.width = "42px";
      circle.style.height = "42px";
      circle.style.transform = "scale(1)";
      circle.style.boxShadow =
        "0 4px 12px rgba(0,0,0,0.25)";
    });
  }, [
    selectedPlace,
    selectedCategory,
  ]);


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


      <button
        onClick={locateUser}
        className="
          absolute
          bottom-40
          right-4
          z-40
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