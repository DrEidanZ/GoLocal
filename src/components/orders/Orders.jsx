import { useState } from "react";

import {
  Package,
  Trash2,
  MapPin,
  Check,
  Clock,
  Truck,
} from "lucide-react";

function Orders({
  orders = [],
  onRemove,
}) {
  const [removingOrders, setRemovingOrders] =
    useState([]);

  const handleRemove = (orderId) => {
    setRemovingOrders((current) => [
      ...current,
      orderId,
    ]);

    setTimeout(() => {
      onRemove(orderId);

      setRemovingOrders((current) =>
        current.filter(
          (id) => id !== orderId
        )
      );
    }, 350);
  };

  const getStatusIndex = (status) => {
    const statuses = [
      "Placed",
      "Preparing",
      "On the way",
      "Delivered",
    ];

    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-24 dark:bg-gray-950">
      <div className="border-b border-gray-100 bg-white px-5 py-5 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep track of your GoLocal orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
            <Package
              size={36}
              className="text-blue-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            No orders yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            Your orders will appear here after you place one.
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {orders.map((order, index) => {
            const quantity =
              order.quantity || 1;

            const unitPrice =
              order.unitPrice ||
              (order.price
                ? Number(
                    String(
                      order.price
                    ).replace("₱", "")
                  ) / quantity
                : 99);

            const subtotal =
              unitPrice * quantity;

            const deliveryFee =
              order.deliveryFee || 49;

            const total =
              subtotal + deliveryFee;

            const isRemoving =
              removingOrders.includes(
                order.id
              );

            const status =
              order.status || "Placed";

            const currentStatusIndex =
              getStatusIndex(status);

            const statuses = [
              {
                name: "Placed",
                icon: Check,
              },
              {
                name: "Preparing",
                icon: Package,
              },
              {
                name: "On the way",
                icon: Truck,
              },
              {
                name: "Delivered",
                icon: Check,
              },
            ];

            return (
              <div
                key={order.id}
                className={`
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:shadow-md
                  dark:border-gray-800
                  dark:bg-gray-900
                  ${
                    isRemoving
                      ? "pointer-events-none"
                      : ""
                  }
                `}
                style={{
                  animation: isRemoving
                    ? "orderCardOut 0.35s ease-in both"
                    : "orderCardIn 0.45s ease-out both",
                  animationDelay: isRemoving
                    ? "0s"
                    : `${index * 0.08}s`,
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                      {order.logo ? (
                        <img
                          src={order.logo}
                          alt={order.name}
                          className="h-9 w-9 object-contain"
                        />
                      ) : (
                        <Package
                          size={22}
                          className="text-blue-500"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {order.name}
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {order.category}
                      </p>
                    </div>

                    <div
                      className={`
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1.5
                        text-xs
                        font-semibold
                        ${
                          status ===
                          "Delivered"
                            ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${
                            status ===
                            "Delivered"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }
                        `}
                      />

                      {status}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Clock size={13} />

                    <span>
                      {status ===
                      "Delivered"
                        ? "Delivered"
                        : "In progress"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
                  <div className="flex items-start">
                    {statuses.map(
                      (
                        statusItem,
                        statusIndex
                      ) => {
                        const Icon =
                          statusItem.icon;

                        const isCompleted =
                          statusIndex <=
                          currentStatusIndex;

                        const isCurrent =
                          statusIndex ===
                          currentStatusIndex;

                        return (
                          <div
                            key={
                              statusItem.name
                            }
                            className="flex min-w-0 flex-1 items-start"
                          >
                            <div className="flex min-w-0 flex-1 flex-col items-center">
                              <div
                                className={`
                                  relative
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-full
                                  transition-all
                                  duration-300
                                  ${
                                    isCompleted
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                  }
                                  ${
                                    isCurrent
                                      ? "scale-110 shadow-[0_0_0_5px_rgba(59,130,246,0.12)]"
                                      : ""
                                  }
                                `}
                              >
                                {isCurrent &&
                                  status !==
                                    "Delivered" && (
                                    <span
                                      className="
                                        absolute
                                        inset-0
                                        animate-ping
                                        rounded-full
                                        bg-blue-400/30
                                      "
                                    />
                                  )}

                                <Icon
                                  size={14}
                                  strokeWidth={2.4}
                                  className="relative z-10"
                                />
                              </div>

                              <span
                                className={`
                                  mt-1.5
                                  text-center
                                  text-[10px]
                                  transition-all
                                  duration-300
                                  ${
                                    isCompleted
                                      ? "font-semibold text-blue-500"
                                      : "font-medium text-gray-400 dark:text-gray-500"
                                  }
                                `}
                              >
                                {
                                  statusItem.name
                                }
                              </span>
                            </div>

                            {statusIndex <
                              statuses.length -
                                1 && (
                              <div className="relative mt-4 h-0.5 flex-1 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <div
                                  className={`
                                    absolute
                                    inset-y-0
                                    left-0
                                    transition-all
                                    duration-500
                                    ease-out
                                    ${
                                      statusIndex <
                                      currentStatusIndex
                                        ? "w-full bg-blue-500"
                                        : "w-0 bg-blue-500"
                                    }
                                  `}
                                />
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
                    <MapPin
                      size={15}
                      className="shrink-0 text-blue-500"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Delivery location
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                        {order.address ||
                          "Your current location"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {order.item ||
                          "Food order"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        ₱{unitPrice} ×{" "}
                        {quantity}
                      </p>
                    </div>

                    <div className="flex h-8 min-w-12 items-center justify-center rounded-lg bg-gray-100 px-2.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      ×{quantity}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      ₱{subtotal}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Delivery fee
                    </span>

                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      ₱{deliveryFee}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Total
                    </span>

                    <span className="text-lg font-extrabold text-blue-500">
                      ₱{total}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  <button
                    onClick={() =>
                      handleRemove(
                        order.id
                      )
                    }
                    disabled={
                      isRemoving
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-red-500 transition duration-200 hover:bg-red-50 active:scale-[0.98] disabled:cursor-default dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={15} />

                    {isRemoving
                      ? "Removing..."
                      : "Remove Order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes orderCardIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes orderCardOut {
            from {
              opacity: 1;
              transform: translateX(0) scale(1);
              max-height: 1000px;
            }

            to {
              opacity: 0;
              transform: translateX(40px) scale(0.96);
              max-height: 0;
              margin-top: -16px;
              margin-bottom: -16px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Orders;