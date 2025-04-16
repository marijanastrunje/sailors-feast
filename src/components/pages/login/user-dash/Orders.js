import React, { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resUser = await fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id: userId } = await resUser.json();

        const resOrders = await fetch(`${backendUrl}/wp-json/wc/v3/orders?customer=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await resOrders.json();
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const labelMap = {
    billing_marina: "Marina",
    billing_charter: "Charter",
    billing_boat: "Boat",
    billing_gate: "Gate",
    billing_number_of_guests: "Number of Guests",
    billing_delivery_date: "Delivery Date",
    billing_delivery_time: "Delivery Time",
    billing_order_notes: "Note",
  };

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>You have no orders.</p>;

  return (
    <div className="container col-md-8 my-5">
      <h2 className="mb-4 text-center">My Orders</h2>

      <style>
        {`
          .accordion-button:not(.collapsed) {
            color: rgb(0, 0, 0);
            background-color: #f2f2f2;
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
          }
          .accordion-button:focus {
            border-color: #ced4da;
            box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25);
          }
          .accordion-button:not(.collapsed)::after {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23495057'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
          }
        `}
      </style>

      <div className="accordion accordion-flush shadow rounded border" id="orders-accordion">
        {orders.map(({ id, date_created, total, status, meta_data, line_items }, index) => (
          <div className="accordion-item" key={id}>
            <h2 className="accordion-header" id={`heading-${id}`}>
              <button
                className="accordion-button collapsed fw-bold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${id}`}
                aria-expanded="false"
                aria-controls={`collapse-${id}`}
              >
                Order #{id} – {new Date(date_created).toLocaleDateString()} – {total} €
              </button>
            </h2>
            <div
              id={`collapse-${id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${id}`}
              data-bs-parent="#orders-accordion"
            >
              <div className="accordion-body bg-light">
                <p><strong>Status:</strong> {status}</p>

                {meta_data?.length > 0 && (
                  <div>
                    <strong>Additional Info:</strong>
                    <ul>
                      {Object.entries(labelMap).map(([key, label]) => {
                        const meta = meta_data.find((m) => m.key === key);
                        return meta?.value ? (
                          <li key={key}>
                            <strong>{label}:</strong> {meta.value}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}

                <p className="mb-1"><strong>Products:</strong></p>
                <ul>
                  {line_items.map(({ id: itemId, name, quantity }) => (
                    <li key={itemId}>
                      {name} × {quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
