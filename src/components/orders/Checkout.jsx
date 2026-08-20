import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShoppingBag,
  Truck,
} from "lucide-react";

function Checkout({
  order,
  onBack,
  onPlaceOrder,
}) {
  if (!order) {
    return null;
  }

  const price = order.price || 99;
  const quantity = order.quantity || 1;
  const deliveryFee = 49;

  const subtotal = price * quantity;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    onPlaceOrder({
      ...order,
      subtotal,
      deliveryFee,
      total,
      status: "Order placed",
    });
  };

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
          <ArrowLeft size={19} />
        </button>

        <div>
          <h1
            className="
              text-lg
              font-bold
              text-gray-900
            "
          >
            Checkout
          </h1>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Review your order
          </p>
        </div>

      </div>
<div className="space-y-4 p-4">
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

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-500
              "
            >
              <ShoppingBag size={21} />
            </div>

            <div className="min-w-0 flex-1">

              <h2
                className="
                  truncate
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {order.item || "Food order"}
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                {order.place}
              </p>

            </div>

            <div className="text-right">

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                × {quantity}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                ₱{price} each
              </p>

            </div>

          </div>

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
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-500
              "
            >
              <MapPin size={19} />
            </div>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Delivery Address
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                Your current location
              </p>

            </div>

          </div>

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
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-500
              "
            >
              <Truck size={19} />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Delivery
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                Standard delivery
              </p>

            </div>

            <span
              className="
                text-sm
                font-semibold
                text-gray-800
              "
            >
              ₱49
            </span>

          </div>

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
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-500
              "
            >
              <CreditCard size={19} />
            </div>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                Payment Method
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                Cash on delivery
              </p>

            </div>

          </div>

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
        >

          <h2
            className="
              text-sm
              font-bold
              text-gray-900
            "
          >
            Order Summary
          </h2>

          <div
            className="
              mt-4
              space-y-3
            "
          >

            <div
              className="
                flex
                justify-between
                text-sm
              "
            >
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium text-gray-800">
                ₱{subtotal}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                text-sm
              "
            >
              <span className="text-gray-500">
                Delivery fee
              </span>

              <span className="font-medium text-gray-800">
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
                  text-xl
                  font-extrabold
                  text-blue-500
                "
              >
                ₱{total}
              </span>

            </div>

          </div>

        </div>
<button
          onClick={handlePlaceOrder}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-blue-500
            px-4
            py-4
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-blue-500/20
            transition
            hover:bg-blue-600
            active:scale-[0.98]
          "
        >

          <ShoppingBag size={18} />

          Place Order · ₱{total}

        </button>

      </div>

    </div>
  );
}

export default Checkout;