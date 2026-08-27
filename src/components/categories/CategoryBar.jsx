import {
  Utensils,
  Hotel,
  Package,
  Car,
} from "lucide-react";

const categories = [
  {
    name: "Food",
    icon: Utensils,
  },
  {
    name: "Hotels",
    icon: Hotel,
  },
  {
    name: "Delivery",
    icon: Package,
  },
  {
    name: "Rides",
    icon: Car,
  },
];

function CategoryBar({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="w-full overflow-x-auto px-4 pb-2 sm:px-6">
      <div className="flex w-max gap-2.5">
        {categories.map((category) => {
          const Icon = category.icon;
          const selected =
            selectedCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() =>
                setSelectedCategory(category.name)
              }
              className={`
                flex
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200
                active:scale-95
                ${
                  selected
                    ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "border-white/80 bg-white/90 text-gray-700 shadow-md backdrop-blur-md hover:border-blue-200 hover:text-blue-500 dark:border-gray-700/80 dark:bg-gray-900/90 dark:text-gray-200 dark:hover:border-blue-700 dark:hover:text-blue-400"
                }
              `}
            >
              <Icon
                size={17}
                strokeWidth={selected ? 2.4 : 2.1}
              />

              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;