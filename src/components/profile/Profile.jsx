import {
  User,
  Heart,
  ShoppingBag,
  MapPin,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function Profile({
  savedCount = 0,
  orderCount = 0,
  onSaved,
  onOrders,
}) {
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
          relative
          overflow-hidden
          bg-white
          px-5
          pb-6
          pt-6
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-32
            w-32
            rounded-full
            bg-blue-100/60
            blur-2xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-12
            bottom-0
            h-24
            w-24
            rounded-full
            bg-blue-50
            blur-2xl
          "
        />

        <div
          className="
            relative
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                text-blue-500
              "
            >
              GoLocal
            </p>

            <h1
              className="
                mt-0.5
                text-2xl
                font-bold
                text-gray-900
              "
            >
              My Profile
            </h1>

          </div>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-blue-50
              text-blue-500
            "
          >
            <Settings size={19} />
          </div>

        </div>
<div
          className="
            relative
            mt-6
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-500
              text-white
              shadow-lg
              shadow-blue-500/20
            "
          >
            <User
              size={30}
              strokeWidth={2}
            />
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
              GoLocal User
            </h2>

            <p
              className="
                mt-0.5
                text-sm
                text-gray-500
              "
            >
              Exploring the city
            </p>

          </div>

        </div>

      </div>
<div
        className="
          grid
          grid-cols-2
          gap-3
          px-4
          pt-4
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
          style={{
            animation:
              "profileCardIn 0.4s ease-out both",
          }}
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
            "
          >
            <Heart
              size={18}
              fill="currentColor"
            />
          </div>

          <p
            className="
              mt-3
              text-2xl
              font-bold
              text-gray-900
            "
          >
            {savedCount}
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-gray-500
            "
          >
            Saved places
          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
          style={{
            animation:
              "profileCardIn 0.4s ease-out 0.08s both",
          }}
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-500
            "
          >
            <ShoppingBag size={18} />
          </div>

          <p
            className="
              mt-3
              text-2xl
              font-bold
              text-gray-900
            "
          >
            {orderCount}
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-gray-500
            "
          >
            Orders
          </p>

        </div>

      </div>
<div className="px-4 pt-5">

        <div
          className="
            flex
            items-center
            gap-2
            px-1
          "
        >

          <Sparkles
            size={16}
            className="text-blue-500"
          />

          <h2
            className="
              text-sm
              font-bold
              text-gray-900
            "
          >
            Quick Access
          </h2>

        </div>


        <div
          className="
            mt-3
            overflow-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
<button
            onClick={onSaved}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-4
              text-left
              transition-all
              duration-200
              ease-out
              hover:bg-gray-50
              active:scale-[0.985]
              active:bg-gray-100
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-500
                transition-transform
                duration-200
                ease-out
                active:scale-90
              "
            >
              <Heart
                size={17}
                fill="currentColor"
              />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Saved places
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-400
                "
              >
                View your favorite spots
              </p>

            </div>

            <ChevronRight
              size={18}
              className="
                text-gray-300
                transition-transform
                duration-200
                ease-out
                active:translate-x-1
              "
            />

          </button>


          <div className="mx-4 border-t border-gray-100" />
<button
            onClick={onOrders}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-4
              text-left
              transition-all
              duration-200
              ease-out
              hover:bg-gray-50
              active:scale-[0.985]
              active:bg-gray-100
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-500
                transition-transform
                duration-200
                ease-out
                active:scale-90
              "
            >
              <ShoppingBag size={17} />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                My orders
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-400
                "
              >
                Check your recent orders
              </p>

            </div>

            <ChevronRight
              size={18}
              className="
                text-gray-300
                transition-transform
                duration-200
                ease-out
                active:translate-x-1
              "
            />

          </button>

        </div>

      </div>
<div className="px-4 pt-5">

        <h2
          className="
            px-1
            text-sm
            font-bold
            text-gray-900
          "
        >
          Preferences
        </h2>


        <div
          className="
            mt-3
            overflow-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
<button
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-4
              text-left
              transition-all
              duration-200
              ease-out
              hover:bg-gray-50
              active:scale-[0.985]
              active:bg-gray-100
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-yellow-50
                text-yellow-500
                transition-transform
                duration-200
                ease-out
                active:scale-90
              "
            >
              <Bell size={17} />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Notifications
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-400
                "
              >
                Stay updated about your orders
              </p>

            </div>

            <ChevronRight
              size={18}
              className="text-gray-300"
            />

          </button>


          <div className="mx-4 border-t border-gray-100" />
<button
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-4
              text-left
              transition-all
              duration-200
              ease-out
              hover:bg-gray-50
              active:scale-[0.985]
              active:bg-gray-100
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-500
                transition-transform
                duration-200
                ease-out
                active:scale-90
              "
            >
              <MapPin size={17} />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Location
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-400
                "
              >
                Manage your location preferences
              </p>

            </div>

            <ChevronRight
              size={18}
              className="text-gray-300"
            />

          </button>

        </div>

      </div>
<div
        className="
          px-4
          pb-6
          pt-8
          text-center
        "
      >

        <p
          className="
            text-xs
            font-medium
            text-gray-400
          "
        >
          GoLocal Prototype
        </p>

        <p
          className="
            mt-1
            text-[11px]
            text-gray-300
          "
        >
          Explore • Discover • GoLocal
        </p>

      </div>
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