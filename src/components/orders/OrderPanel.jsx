import { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Truck,
  Check,
} from "lucide-react";

function OrderPanel({
  place,
  onClose,
  onAdd,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  if (!place) return null;

  const price = place.price || 99;
  const deliveryFee = 49;

  const subtotal = price * quantity;
  const total = subtotal + deliveryFee;

  const increase = () => {
    setQuantity((value) => value + 1);
  };

  const decrease = () => {
    setQuantity((value) => Math.max(1, value - 1));
  };

  const handleAdd = () => {
    if (isPlacing) return;

    setIsPlacing(true);

    setTimeout(() => {
      setIsPlaced(true);

      setTimeout(() => {
        onAdd({
          id: Date.now(),
          place: place.name,
          item: place.item || "Food order",
          price: `₱${subtotal}`,
          quantity,
          status: "Preparing",
          statusType: "active",
          time: "Just now",
          address: "Your delivery address",
        });

        onClose();
      }, 1800);
    }, 250);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/30
        p-3
      "
    >
      <div
        className="
          w-full
          max-w-sm
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
<div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
            py-3
          "
        >

          <div className="flex items-center gap-2.5">

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

            <div>

              <h2 className="text-sm font-bold text-gray-900">
                Order Now
              </h2>

              <p className="max-w-40 truncate text-xs text-gray-500">
                {place.name}
              </p>

            </div>

          </div>

          {!isPlacing && (
            <button
              onClick={onClose}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-500
                transition
                duration-150
                hover:bg-gray-200
                active:scale-90
              "
              aria-label="Close order"
            >
              <X size={16} />
            </button>
          )}

        </div>
{isPlaced ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-5
              py-10
              text-center
            "
          >

            <div
              className="
                relative
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-green-100
              "
            >

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="29"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="
                    text-green-500
                    animate-circle-draw
                  "
                />
              </svg>

              <Check
                size={30}
                strokeWidth={3}
                className="
                  relative
                  z-10
                  text-green-500
                  animate-check-draw
                "
              />

            </div>

            <h2
              className="
                mt-4
                text-lg
                font-bold
                text-gray-900
              "
            >
              Order Placed!
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Your order is being prepared.
            </p>

          </div>

        ) : (

          /* ORDER CONTENT */

          <div className="p-4">
<div
              className="
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                bg-gray-50
                px-3
                py-3
              "
            >

              <div className="min-w-0">

                <h3
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-gray-900
                  "
                >
                  {place.item || "Food order"}
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  ₱{price} each
                </p>

              </div>
<div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-1
                  shadow-sm
                "
              >

                <button
                  onClick={decrease}
                  disabled={quantity <= 1}
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-600
                    transition
                    duration-150
                    hover:bg-gray-100
                    active:scale-90
                    disabled:opacity-30
                  "
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                <span
                  className="
                    w-6
                    text-center
                    text-sm
                    font-bold
                    text-gray-900
                  "
                >
                  {quantity}
                </span>

                <button
                  onClick={increase}
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-500
                    text-white
                    transition
                    duration-150
                    hover:bg-blue-600
                    active:scale-90
                  "
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>

              </div>

            </div>
<div
              className="
                mt-3
                flex
                items-center
                gap-2.5
                rounded-xl
                bg-blue-50
                px-3
                py-2.5
              "
            >

              <Truck
                size={16}
                className="shrink-0 text-blue-500"
              />

              <div>

                <p className="text-xs font-semibold text-gray-800">
                  Delivery
                </p>

                <p className="text-xs text-gray-500">
                  Current location
                </p>

              </div>

            </div>
<div className="mt-4 space-y-2">

              <div className="flex justify-between text-xs">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium text-gray-800">
                  ₱{subtotal}
                </span>

              </div>

              <div className="flex justify-between text-xs">

                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-medium text-gray-800">
                  ₱{deliveryFee}
                </span>

              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-gray-100
                  pt-2.5
                "
              >

                <span className="text-sm font-bold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-extrabold text-blue-500">
                  ₱{total}
                </span>

              </div>

            </div>
<button
              onClick={handleAdd}
              disabled={isPlacing}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-500
                px-4
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                duration-200
                hover:bg-blue-600
                active:scale-95
                disabled:cursor-wait
              "
            >

              {isPlacing ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={17} />

                  Proceed to Order
                </>
              )}

            </button>
{!isPlacing && (
              <button
                onClick={onClose}
                className="
                  mt-1
                  w-full
                  rounded-xl
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-gray-500
                  transition
                  duration-150
                  hover:bg-gray-50
                  active:scale-95
                "
              >
                Cancel
              </button>
            )}

          </div>

        )}

      </div>
<style>
        {`
          @keyframes circleDraw {
            from {
              stroke-dasharray: 183;
              stroke-dashoffset: 183;
              transform: rotate(-90deg);
              transform-origin: center;
            }

            to {
              stroke-dasharray: 183;
              stroke-dashoffset: 0;
              transform: rotate(-90deg);
              transform-origin: center;
            }
          }

          @keyframes checkDraw {
            from {
              stroke-dasharray: 40;
              stroke-dashoffset: 40;
              opacity: 0;
            }

            30% {
              opacity: 1;
            }

            to {
              stroke-dasharray: 40;
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }

          .animate-circle-draw {
            animation: circleDraw 1.2s ease-out forwards;
          }

          .animate-check-draw {
            animation: checkDraw 0.65s ease-out 0.8s forwards;
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
            opacity: 0;
          }
        `}
      </style>

    </div>
  );
}

export default OrderPanel;