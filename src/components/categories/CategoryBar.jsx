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
    <div
      className="
        w-full
        overflow-x-auto
        px-4
        pb-2
      "
    >
      <div
        className="
          flex
          w-max
          gap-2
        "
      >
        {categories.map((category) => {
          const Icon = category.icon;

          const selected =
            selectedCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() =>
                setSelectedCategory(
                  category.name
                )
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
                shadow-md
                transition-all
                duration-200
                active:scale-95

                ${
                  selected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }
              `}
            >
              <Icon
                size={17}
                strokeWidth={2.2}
              />

              <span>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;