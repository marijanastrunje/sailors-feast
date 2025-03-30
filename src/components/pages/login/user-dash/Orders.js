import React, { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

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
    <div className="col-md-4">
      <h4>Your Orders</h4>
      <ul className="list-group mt-3">
        {orders.map(({ id, date_created, total, status, meta_data, line_items }) => (
          <li
            key={id}
            className="list-group-item"
            onClick={() => toggleOrder(id)}
            style={{ cursor: "pointer" }}
            aria-controls={`order-details-${id}`}
          >
            <div className="d-flex justify-content-between">
              <div><strong>#</strong>{id}</div>
              <div>{new Date(date_created).toLocaleDateString()}</div>
              <div><strong>{total} €</strong></div>
            </div>

            {expandedOrderId === id && (
              <div id={`order-details-${id}`} className="mt-3">
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
