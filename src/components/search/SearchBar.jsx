import {
  Search,
  X,
  Star,
} from "lucide-react";

function SearchBar({
  searchText,
  setSearchText,
  searchResults = [],
  onResultSelect,
}) {
  const clearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <Search
          size={20}
          strokeWidth={2.2}
          className="shrink-0 text-gray-400 dark:text-gray-500"
        />

        <input
          type="text"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
          placeholder="Search places, restaurants, hotels..."
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
        />

        {searchText && (
          <button
            onClick={clearSearch}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 active:scale-90 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {searchText.trim() &&
        searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="max-h-72 overflow-y-auto">
              {searchResults.map((place) => (
                <button
                  key={`${place.category}-${place.name}`}
                  onClick={() =>
                    onResultSelect(place)
                  }
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 dark:active:bg-gray-800"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    {place.logo ? (
                      <img
                        src={place.logo}
                        alt=""
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <Search
                        size={18}
                        className="text-blue-500"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {place.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {place.category}
                      </span>

                      <span className="text-gray-300 dark:text-gray-600">
                        •
                      </span>

                      <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {place.rating}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      {searchText.trim() &&
        searchResults.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-100 bg-white px-4 py-5 text-center shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <Search
              size={24}
              className="mx-auto text-gray-300 dark:text-gray-600"
            />

            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              No places found
            </p>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Try searching for another place.
            </p>
          </div>
        )}
    </div>
  );
}

export default SearchBar;