import { useState } from "react";

import {
  Heart,
  MapPin,
  Star,
  Trash2,
  ArrowRight,
  Bookmark,
} from "lucide-react";

function Saved({
  places = [],
  onExplore,
  onSelect,
  onRemove,
}) {
  const [removingPlace, setRemovingPlace] =
    useState(null);

  const handleRemove = (place) => {
    if (removingPlace) return;

    setRemovingPlace(place.name);

    setTimeout(() => {
      onRemove(place);
      setRemovingPlace(null);
    }, 450);
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-50
        pb-24
      "
    >
<div
        className="
          border-b
          border-gray-100
          bg-white
          px-5
          py-5
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-500
            "
          >
            <Heart
              size={21}
              fill="currentColor"
            />
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >
              Saved Places
            </h1>

            <p
              className="
                mt-0.5
                text-sm
                text-gray-500
              "
            >
              Your favorite places in one spot
            </p>

          </div>

        </div>

      </div>
{places.length === 0 ? (

        <div
          className="
            flex
            min-h-[70vh]
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-400
            "
          >
            <Bookmark size={34} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-bold
              text-gray-900
            "
          >
            Nothing saved yet
          </h2>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-gray-500
            "
          >
            Save your favorite restaurants,
            hotels, and places to find them
            quickly later.
          </p>

          <button
            onClick={onExplore}
            className="
              mt-5
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-500
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              duration-200
              hover:bg-blue-600
              active:scale-95
            "
          >
            Explore Places

            <ArrowRight size={16} />
          </button>

        </div>

      ) : (

        /* SAVED PLACES */

        <div className="space-y-3 p-4">

          {places.map((place, index) => {

            const isRemoving =
              removingPlace === place.name;

            return (
              <div
                key={place.name}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  duration-200
                  hover:shadow-md
                "
                style={{
                  animation: isRemoving
                    ? "savedCardOut 0.45s ease-in forwards"
                    : "savedCardIn 0.4s ease-out both",
                  animationDelay: isRemoving
                    ? "0s"
                    : `${index * 0.07}s`,
                }}
              >

                <div className="p-4">
<div
                    className="
                      flex
                      items-center
                      gap-3
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
                        bg-gray-50
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
<div className="min-w-0 flex-1">

                      <h2
                        className="
                          truncate
                          text-base
                          font-bold
                          text-gray-900
                        "
                      >
                        {place.name}
                      </h2>

                      <div
                        className="
                          mt-1
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
<button
                      onClick={() =>
                        handleRemove(place)
                      }
                      disabled={!!removingPlace}
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-red-500
                        transition
                        duration-150
                        hover:bg-red-100
                        active:scale-90
                        disabled:cursor-wait
                      "
                      aria-label={`Remove ${place.name} from saved`}
                    >

                      <Heart
                        size={17}
                        fill="currentColor"
                      />

                    </button>

                  </div>
<p
                    className="
                      mt-3
                      line-clamp-2
                      text-xs
                      leading-5
                      text-gray-500
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
                      onClick={() =>
                        onSelect(place)
                      }
                      disabled={!!removingPlace}
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-500
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-white
                        transition
                        duration-200
                        hover:bg-blue-600
                        active:scale-95
                        disabled:opacity-60
                      "
                    >

                      <MapPin size={15} />

                      View Place

                    </button>


                    <button
                      onClick={() =>
                        handleRemove(place)
                      }
                      disabled={!!removingPlace}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gray-50
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-gray-500
                        transition
                        duration-200
                        hover:bg-red-50
                        hover:text-red-500
                        active:scale-95
                        disabled:cursor-wait
                      "
                    >

                      <Trash2 size={15} />

                      Remove

                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}
<style>
        {`
          @keyframes savedCardIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes savedCardOut {
            0% {
              opacity: 1;
              transform: scale(1);
              max-height: 300px;
              margin-bottom: 0.75rem;
            }

            45% {
              opacity: 0;
              transform: scale(0.97);
            }

            100% {
              opacity: 0;
              transform: scale(0.94);
              max-height: 0;
              margin-bottom: 0;
              padding-top: 0;
              padding-bottom: 0;
            }
          }
        `}
      </style>

    </div>
  );
}

export default Saved;