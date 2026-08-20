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
          border-b
          border-gray-100
          bg-white
          px-5
          py-5
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Your Orders
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Keep track of your GoLocal orders
        </p>
      </div>


      {/* EMPTY STATE */}

      {orders.length === 0 ? (

        <div
          className="
            flex
            min-h-[70vh]
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-blue-50
            "
          >
            <Package
              size={36}
              className="text-blue-500"
            />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-bold
              text-gray-900
            "
          >
            No orders yet
          </h2>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-gray-500
            "
          >
            Your orders will appear here after
            you place one.
          </p>
        </div>

      ) : (

        /* ORDERS */

        <div className="space-y-4 p-4">

          {orders.map((order, index) => {

            const quantity =
              order.quantity || 1;

            const unitPrice =
              order.unitPrice ||
              (
                order.price
                  ? Number(
                      String(order.price)
                        .replace("₱", "")
                    ) / quantity
                  : 99
              );

            const subtotal =
              unitPrice * quantity;

            const deliveryFee =
              order.deliveryFee || 49;

            const total =
              subtotal + deliveryFee;

            return (
              <div
                key={order.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:shadow-md
                "
                style={{
                  animation:
                    "orderCardIn 0.45s ease-out both",
                  animationDelay:
                    `${index * 0.08}s`,
                }}
              >

                {/* ORDER HEADER */}

                <div className="p-4">

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    {/* LOGO */}

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        bg-gray-50
                      "
                    >
                      {order.logo ? (
                        <img
                          src={order.logo}
                          alt={order.name}
                          className="
                            h-9
                            w-9
                            object-contain
                          "
                        />
                      ) : (
                        <Package
                          size={22}
                          className="text-blue-500"
                        />
                      )}
                    </div>


                    {/* NAME */}

                    <div className="min-w-0 flex-1">

                      <h2
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-gray-900
                        "
                      >
                        {order.name}
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-500
                        "
                      >
                        {order.category}
                      </p>

                    </div>


                    {/* STATUS */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        bg-green-50
                        px-2.5
                        py-1.5
                        text-xs
                        font-semibold
                        text-green-600
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          animate-pulse
                          rounded-full
                          bg-green-500
                        "
                      />

                      {order.status || "Preparing"}
                    </div>

                  </div>


                  {/* ORDER TIME */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      text-gray-400
                    "
                  >
                    <Clock size={13} />

                    <span>
                      {order.time || "Just now"}
                    </span>
                  </div>

                </div>


                {/* PROGRESS */}

                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                    "
                  >

                    {/* STEP 1 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-500
                          text-white
                        "
                      >
                        <Check size={14} />
                      </div>

                      <span
                        className="
                          mt-1.5
                          text-[10px]
                          font-medium
                          text-blue-500
                        "
                      >
                        Placed
                      </span>
                    </div>


                    {/* LINE */}

                    <div
                      className="
                        mb-5
                        h-0.5
                        flex-1
                        bg-blue-500
                      "
                    />


                    {/* STEP 2 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-500
                          text-white
                        "
                      >
                        <Package size={14} />
                      </div>

                      <span
                        className="
                          mt-1.5
                          text-[10px]
                          font-semibold
                          text-blue-500
                        "
                      >
                        Preparing
                      </span>
                    </div>


                    {/* LINE */}

                    <div
                      className="
                        mb-5
                        h-0.5
                        flex-1
                        bg-gray-200
                      "
                    />


                    {/* STEP 3 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-gray-100
                          text-gray-400
                        "
                      >
                        <Truck size={14} />
                      </div>

                      <span
                        className="
                          mt-1.5
                          text-[10px]
                          font-medium
                          text-gray-400
                        "
                      >
                        On the way
                      </span>
                    </div>


                    {/* LINE */}

                    <div
                      className="
                        mb-5
                        h-0.5
                        flex-1
                        bg-gray-200
                      "
                    />


                    {/* STEP 4 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-gray-100
                          text-gray-400
                        "
                      >
                        <Check size={14} />
                      </div>

                      <span
                        className="
                          mt-1.5
                          text-[10px]
                          font-medium
                          text-gray-400
                        "
                      >
                        Delivered
                      </span>
                    </div>

                  </div>

                </div>


                {/* DELIVERY */}

                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-gray-50
                      px-3
                      py-2.5
                    "
                  >

                    <MapPin
                      size={15}
                      className="shrink-0 text-blue-500"
                    />

                    <div className="min-w-0">

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-gray-700
                        "
                      >
                        Delivery location
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[11px]
                          text-gray-400
                        "
                      >
                        {order.address ||
                          "Your current location"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ORDER ITEM */}

                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {order.item ||
                          "Food order"}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        ₱{unitPrice} × {quantity}
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        h-8
                        min-w-12
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-100
                        px-2.5
                        text-xs
                        font-bold
                        text-gray-600
                      "
                    >
                      ×{quantity}
                    </div>

                  </div>

                </div>


                {/* SUMMARY */}

                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      text-xs
                    "
                  >

                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span
                      className="
                        font-medium
                        text-gray-800
                      "
                    >
                      ₱{subtotal}
                    </span>

                  </div>


                  <div
                    className="
                      mt-2
                      flex
                      justify-between
                      text-xs
                    "
                  >

                    <span className="text-gray-500">
                      Delivery fee
                    </span>

                    <span
                      className="
                        font-medium
                        text-gray-800
                      "
                    >
                      ₱{deliveryFee}
                    </span>

                  </div>


                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      border-t
                      border-gray-100
                      pt-3
                    "
                  >

                    <span
                      className="
                        text-sm
                        font-bold
                        text-gray-900
                      "
                    >
                      Total
                    </span>

                    <span
                      className="
                        text-lg
                        font-extrabold
                        text-blue-500
                      "
                    >
                      ₱{total}
                    </span>

                  </div>

                </div>


                {/* REMOVE */}

                <div
                  className="
                    border-t
                    border-gray-100
                    px-4
                    py-3
                  "
                >

                  <button
                    onClick={() =>
                      onRemove(order.id)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-red-500
                      transition
                      duration-200
                      hover:bg-red-50
                      active:scale-[0.98]
                    "
                  >

                    <Trash2 size={15} />

                    Remove Order

                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}


      {/* CARD ANIMATION */}

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
        `}
      </style>

    </div>
  );
}

export default Orders;