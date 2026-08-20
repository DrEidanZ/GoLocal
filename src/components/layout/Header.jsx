import { useState } from "react";

import {
  Bell,
  User,
  Sparkles,
  CheckCircle,
  Heart,
  Package,
  Trash2,
} from "lucide-react";


function Header({
  onProfile,
  notifications = [],
}) {
  const [showNotifications, setShowNotifications] =
    useState(false);

  const hasUnread =
    notifications.length > 0;


  const toggleNotifications = () => {
    setShowNotifications((value) => !value);
  };


  return (
    <header
      className="
        relative
        z-30
        flex
        items-center
        justify-between
        px-4
        py-3
      "
    >

      {/* GOLOCAL TEXT CARD */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/80
          bg-white/90
          px-3
          py-2
          shadow-md
          backdrop-blur-md
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -left-3
            -top-3
            h-12
            w-12
            rounded-full
            bg-blue-100/50
            blur-xl
          "
        />

        <Sparkles
          size={12}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            right-3
            top-1
            animate-pulse
            text-blue-300
          "
        />

        <Sparkles
          size={9}
          strokeWidth={2}
          className="
            pointer-events-none
            absolute
            bottom-1
            left-20
            animate-pulse
            text-blue-300
          "
        />

        <div className="relative z-10">

          <div className="flex items-center gap-1">

            <h1
              className="
                text-xl
                font-extrabold
                tracking-tight
                text-gray-900
              "
            >
              GoLocal
            </h1>

            <Sparkles
              size={12}
              strokeWidth={2.2}
              className="
                ml-1
                animate-pulse
                text-blue-400
              "
            />

          </div>

          <p
            className="
              text-xs
              font-medium
              text-gray-600
            "
          >
            Explore your city
          </p>

        </div>

      </div>


      {/* BUTTONS */}

      <div
        className="
          relative
          z-30
          flex
          gap-2
        "
      >

        {/* NOTIFICATIONS */}

        <button
          onClick={toggleNotifications}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-gray-100
            bg-white
            text-gray-700
            shadow-md
            transition-all
            duration-150
            hover:scale-105
            hover:text-blue-500
            active:scale-90
          "
          aria-label="Notifications"
        >

          <Bell
            size={20}
            strokeWidth={2.2}
          />

          {hasUnread && (
            <span
              className="
                absolute
                right-1.5
                top-1.5
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
          )}

        </button>


        {/* PROFILE */}

        <button
          onClick={onProfile}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-gray-100
            bg-white
            text-gray-700
            shadow-md
            transition-all
            duration-150
            hover:scale-105
            hover:text-blue-500
            active:scale-90
          "
          aria-label="Profile"
        >

          <User
            size={20}
            strokeWidth={2.2}
          />

        </button>


        {/* NOTIFICATION POPUP */}

        {showNotifications && (
          <div
            className="
              absolute
              right-0
              top-12
              z-50
              w-[min(18rem,calc(100vw-2rem))]
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-white
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div
              className="
                border-b
                border-gray-100
                px-4
                py-3
              "
            >

              <h2
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Notifications
              </h2>

            </div>


            {/* NOTIFICATIONS */}

            {notifications.length > 0 ? (

              <div
                className="
                  max-h-72
                  overflow-y-auto
                "
              >

                {notifications.map(
                  (notification) => (

                    <div
                      key={notification.id}
                      className="
                        flex
                        gap-3
                        border-b
                        border-gray-100
                        px-4
                        py-4
                        last:border-b-0
                      "
                    >

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-50
                        "
                      >

                        {notification.type ===
                          "saved" && (
                          <Heart
                            size={18}
                            className="text-red-500"
                            fill="currentColor"
                          />
                        )}

                        {notification.type ===
                          "order" && (
                          <Package
                            size={18}
                            className="text-blue-500"
                          />
                        )}

                        {notification.type ===
                          "removed" && (
                          <Trash2
                            size={18}
                            className="text-gray-500"
                          />
                        )}

                        {notification.type ===
                          "welcome" && (
                          <CheckCircle
                            size={18}
                            className="text-blue-500"
                          />
                        )}

                      </div>


                      <div className="min-w-0">

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {notification.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-5
                            text-gray-500
                          "
                        >
                          {notification.message}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div
                className="
                  px-4
                  py-8
                  text-center
                "
              >

                <Bell
                  size={28}
                  className="
                    mx-auto
                    text-gray-300
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  No notifications
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  You're all caught up.
                </p>

              </div>

            )}


            {/* FOOTER */}

            <div
              className="
                border-t
                border-gray-100
                px-4
                py-3
                text-center
              "
            >

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                GoLocal notifications
              </p>

            </div>

          </div>
        )}

      </div>

    </header>
  );
}


export default Header;