import {
  Compass,
  Package,
  Heart,
  User,
} from "lucide-react";

const navigation = [
  { icon: Compass, label: "Explore" },
  { icon: Package, label: "Orders" },
  { icon: Heart, label: "Saved" },
  { icon: User, label: "Profile" },
];

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        z-50
        flex items-center justify-around
        border-t border-gray-200
        bg-white/95
        px-2 py-3
        shadow-lg
        backdrop-blur-md
      "
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.label;

        return (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`
              flex flex-col items-center
              gap-1
              rounded-xl
              px-4 py-1.5
              text-xs font-medium
              transition-all duration-200
              active:scale-90
              ${
                isActive
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            <Icon
              size={21}
              strokeWidth={isActive ? 2.5 : 2}
              className={`
                transition-transform duration-200
                ${isActive ? "scale-110" : ""}
              `}
            />

            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;