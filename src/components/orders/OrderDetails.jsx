import { useState } from "react";

import {
  ArrowLeft,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

function OrderDetails({
  place,
  onBack,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!place) {
    return null;
  }

  const price = 150;
  const subtotal = price * quantity;
  const deliveryFee = 49;
  const total = subtotal + deliveryFee;

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-50
        pb-24
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-gray-100
          bg-white
          px-4
          py-4
        "
      >

        <button
          onClick={onBack}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gray-100
            text-gray-700
            transition
            hover:bg-gray-200
            active:scale-90
          "
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1
          className="
            text-lg
            font-bold
            text-gray-900
          "
        >
          Order Details
        </h1>

      </div>


      {/* PLACE */}

      <div
        className="
          border-b
          border-gray-100
          bg-white
          p-4
        "
      >

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
              rounded-xl
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
              <ShoppingBag
                size={25}
                className="text-blue-500"
              />
            )}

          </div>

          <div className="min-w-0">

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

            <p
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              {place.category}
            </p>

          </div>

        </div>

      </div>


      {/* ITEM */}

      <div className="p-4">

        <div
          className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                GoLocal Order
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                ₱{price} per item
              </p>

            </div>


            {/* QUANTITY */}

            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-gray-200
                px-2
                py-1.5
              "
            >

              <button
                onClick={() =>
                  setQuantity((value) =>
                    Math.max(1, value - 1)
                  )
                }
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-100
                  text-gray-600
                  active:scale-90
                "
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span
                className="
                  block
                  text-center
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((value) =>
                    value + 1
                  )
                }
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-500
                  active:scale-90
                "
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>

            </div>

          </div>

        </div>


        {/* DELIVERY */}

        <div
          className="
            mt-3
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
        >

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
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-blue-50
              "
            >
              <MapPin
                size={19}
                className="text-blue-500"
              />
            </div>

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Delivery location
              </p>

              <p
                className="
                  mt-0.5
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Your current location
              </p>

            </div>

          </div>

        </div>


        {/* SUMMARY */}

        <div
          className="
            mt-3
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
        >

          <h3
            className="
              text-sm
              font-bold
              text-gray-900
            "
          >
            Order Summary
          </h3>

          <div
            className="
              mt-4
              space-y-3
              text-sm
            "
          >

            <div
              className="
                flex
                justify-between
              "
            >
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium">
                ₱{subtotal}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span className="text-gray-500">
                Delivery fee
              </span>

              <span className="font-medium">
                ₱{deliveryFee}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                border-t
                border-gray-100
                pt-3
              "
            >

              <span
                className="
                  font-bold
                  text-gray-900
                "
              >
                Total
              </span>

              <span
                className="
                  font-bold
                  text-blue-500
                "
              >
                ₱{total}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* CONFIRM BUTTON */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-40
          border-t
          border-gray-100
          bg-white
          p-4
        "
      >

        <button
          onClick={() =>
            onConfirm({
              ...place,
              quantity,
              subtotal,
              deliveryFee,
              total,
            })
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-500
            px-4
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            hover:bg-blue-600
            active:scale-95
          "
        >

          <ShoppingBag size={18} />

          Confirm Order · ₱{total}

        </button>

      </div>

    </div>
  );
}

export default OrderDetails;