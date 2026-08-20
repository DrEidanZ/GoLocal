import {
  Map,
  Heart,
  MapPin,
  Star,
  ShoppingBag,
} from "lucide-react";

function PlaceCard({
  place,
  position,
  isSaved,
  onClose,
  onSave,
  onOrder,
}) {
  if (!place || !position) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        absolute
        z-50
        w-[calc(100%-2rem)]
        max-w-md
        -translate-x-1/2
        -translate-y-full
      "
      style={{
        left: position.x,
        top: position.y - 42,
      }}
    >
      <div
        className="
          pointer-events-auto
          relative
          overflow-hidden
          rounded-3xl
          border
          border-gray-100
          bg-white
          shadow-2xl
        "
      >
        <div className="relative p-4">
<button
            onClick={onClose}
            className="
              absolute
              right-3
              top-3
              z-10
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-600
              transition
              hover:bg-gray-200
              active:scale-90
            "
            aria-label="Close"
          >
            <span className="text-lg">
              ×
            </span>
          </button>
<div
            className="
              flex
              items-center
              gap-3
              pr-10
            "
          >
<div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-gray-50
                shadow-sm
              "
            >
              {place.logo ? (
                <img
                  src={place.logo}
                  alt={place.name}
                  className="
                    h-10
                    w-10
                    object-contain
                  "
                />
              ) : (
                <MapPin
                  size={25}
                  className="text-blue-500"
                />
              )}
            </div>
<div className="min-w-0">

              <h2
                className="
                  truncate
                  text-lg
                  font-bold
                  text-gray-900
                "
              >
                {place.name}
              </h2>

              <div
                className="
                  mt-0.5
                  flex
                  items-center
                  gap-1.5
                "
              >

                <span
                  className="
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  {place.category}
                </span>

                <span className="text-gray-300">
                  •
                </span>

                <Star
                  size={12}
                  className="
                    fill-yellow-400
                    text-yellow-400
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-gray-600
                  "
                >
                  {place.rating}
                </span>

              </div>

            </div>

          </div>
<p
            className="
              mt-3
              text-sm
              leading-5
              text-gray-600
            "
          >
            {place.description}
          </p>
<div
            className="
              mt-4
              flex
              gap-2
            "
          >
<button
              onClick={() => {
                const url =
                  `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[1]},${place.coordinates[0]}`;

                window.open(
                  url,
                  "_blank"
                );
              }}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-500
                px-3
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-600
                active:scale-95
              "
            >
              <Map size={17} />

              Directions
            </button>
<button
              onClick={() => {
                onOrder(place);
              }}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-green-500
                px-3
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-green-600
                active:scale-95
              "
            >
              <ShoppingBag size={17} />

              Order
            </button>
<button
              onClick={onSave}
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                transition-all
                active:scale-95
                ${
                  isSaved
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }
              `}
              aria-label={
                isSaved
                  ? "Unsave place"
                  : "Save place"
              }
            >
              <Heart
                size={18}
                fill={
                  isSaved
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

          </div>

        </div>
      </div>
<div
        className="
          absolute
          left-1/2
          top-full
          h-0
          w-0
          -translate-x-1/2
        "
        style={{
          borderLeft:
            "12px solid transparent",

          borderRight:
            "12px solid transparent",

          borderTop:
            "16px solid white",
        }}
      />

    </div>
  );
}

export default PlaceCard;