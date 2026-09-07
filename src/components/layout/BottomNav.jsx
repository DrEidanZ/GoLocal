import {
  Compass,
  Package,
  Heart,
  User,
} from "lucide-react";

const navigation = [
  {
    icon: Compass,
    label: "Explore",
    value: "explore",
  },
  {
    icon: Package,
    label: "Orders",
    value: "orders",
  },
  {
    icon: Heart,
    label: "Saved",
    value: "saved",
  },
  {
    icon: User,
    label: "Profile",
    value: "profile",
  },
];

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-gray-200/70
        bg-white/90
        px-2
        pb-[max(0.5rem,env(safe-area-inset-bottom))]
        pt-2
        shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        dark:border-gray-800/80
        dark:bg-gray-950/90
        dark:shadow-[0_-8px_30px_rgba(0,0,0,0.3)]
      "
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setActiveTab(item.value)
              }
              className={`
                relative
                flex
                min-w-[64px]
                flex-col
                items-center
                gap-1
                rounded-2xl
                px-3
                py-1.5
                text-[11px]
                font-semibold
                transition-all
                duration-200
                active:scale-90
                ${
                  isActive
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }
              `}
            >
              <span
                className={`
                  absolute
                  -top-2
                  h-1
                  w-8
                  rounded-full
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-500 opacity-100"
                      : "bg-transparent opacity-0"
                  }
                `}
              />

              <span
                className={`
                  flex
                  h-9
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50"
                      : "bg-transparent"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                  className={`
                    transition-transform
                    duration-200
                    ${
                      isActive
                        ? "scale-110"
                        : ""
                    }
                  `}
                />
              </span>

              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;