import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resUser = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await resUser.json();
        const userId = userData.id;

        const resOrders = await fetch(
          `https://backend.sailorsfeast.com/wp-json/wc/v3/orders?customer=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ordersData = await resOrders.json();
        setOrders(ordersData);
      } catch (err) {
        console.error("Greška pri dohvaćanju narudžbi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) return <p>Učitavanje narudžbi...</p>;
  if (!orders.length) return <p>Nemate nijednu narudžbu.</p>;

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const labelMap = {
    billing_marina: "Marina",
    billing_charter: "Charter",
    billing_boat: "Brod",
    billing_gate: "Gate",
    billing_number_of_guests: "Broj gostiju",
    billing_delivery_date: "Datum dostave",
    billing_delivery_time: "Vrijeme dostave",
    billing_order_notes: "Napomena"
  };

  return (
    <div className="col-md-4">
      <h4>Vaše narudžbe</h4>
      <ul className="list-group mt-3">
        {orders.map((order) => (
          <li
            key={order.id}
            className="list-group-item"
            onClick={() => toggleOrder(order.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex justify-content-between">
              <div><strong>#</strong>{order.id}</div>
              <div>{new Date(order.date_created).toLocaleDateString()}</div>
              <div><strong>{order.total} €</strong></div>
            </div>

            {expandedOrderId === order.id && (
              <div className="mt-3">
                <p><strong>Status:</strong> {order.status}</p>    

                {order.meta_data && (
                  <div>
                    <strong>Dodatne informacije:</strong>
                    <ul>
                      {Object.keys(labelMap).map((key) => {
                        const meta = order.meta_data.find((m) => m.key === key);
                        if (!meta || !meta.value) return null;

                        return (
                          <li key={key}>
                            <strong>{labelMap[key]}:</strong> {meta.value}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <p className="mb-1"><strong>Proizvodi:</strong></p>
                <ul>
                  {order.line_items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
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
