import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import './Orders.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const resUser = await fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id: userId } = await resUser.json();

        const resOrders = await fetch(`${backendUrl}/wp-json/wc/v3/orders?customer=${userId}&per_page=100`, {
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

  const isPaid = (order) => order.status === "completed" || order.status === "processing";
  const isBankTransfer = (order) => order.payment_method === "banktransfer";
  const isCashPayment = (order) => order.payment_method === "cod";

  const formatPaymentData = (order) => {
    const amount = parseFloat(order.total).toFixed(2);
    const recipient = "Sailor's Feast d.o.o.";
    const recipientAddress = "Ivana Meštrovića 35, 10000 Zagreb";
    const recipientIBAN = "HR9124020061101222221";
    const model = "HR01";
    const reference = `${order.id}-${new Date(order.date_created).getFullYear()}`;
    const description = `Order #${order.id}`;
    const customerName = `${order.billing.first_name} ${order.billing.last_name}`;

    return `HRVHUB30\nEUR\n${amount}\n${customerName}\n.\n.\n${recipient}\n${recipientAddress}\n${recipientIBAN}\n${model}\n${reference}\nCOST\n${description}`;
  };

  const handleShowQRCode = (order) => {
    setSelectedOrder(order);
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setSelectedOrder(null);
  };

  const handleCopyBankDetails = (order) => {
    const bankDetails = `Recipient: Sailor's Feast d.o.o.\nIBAN: HR9124020061101222221\nReference number: ${order.id}-${new Date(order.date_created).getFullYear()}\nAmount: ${parseFloat(order.total).toFixed(2)} EUR\nDescription: Order #${order.id}`;
    navigator.clipboard.writeText(bankDetails.trim());
    alert("Bank details copied to clipboard!");
  };

  const getPaymentDeadline = (order) => {
    const deliveryDateMeta = order.meta_data?.find((m) => m.key === "billing_delivery_date");
    if (deliveryDateMeta?.value) {
      const deliveryDate = new Date(deliveryDateMeta.value);
      const deadline = new Date(deliveryDate);
      deadline.setDate(deliveryDate.getDate() - 7);
      return deadline.toLocaleDateString();
    }
    const orderDate = new Date(order.date_created);
    orderDate.setDate(orderDate.getDate() + 3);
    return orderDate.toLocaleDateString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed": return "bg-success";
      case "processing": return "bg-primary";
      case "on-hold": return "bg-warning text-dark";
      case "pending": return "bg-info text-dark";
      case "failed": return "bg-danger";
      case "cancelled": return "bg-secondary";
      default: return "bg-light text-dark";
    }
  };

  const labelMap = {
    billing_marina: "Marina",
    billing_charter: "Charter",
    billing_boat: "Boat",
    billing_gate: "Gate",
    billing_number_of_guests: "Number of Guests",
    billing_delivery_date: "Delivery Date",
    billing_delivery_time: "Delivery Time",
    billing_order_notes: "Notes",
    payment_deadline: "Payment Deadline",
  };

  if (loading) return <div className="d-flex justify-content-center my-5"><div className="spinner-border text-prim" role="status"></div></div>;

  if (!orders.length) return <div className="container col-md-8 my-5 text-center"><h2 className="mb-4">My Orders</h2><div className="alert alert-info">You have no orders yet.</div></div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">My Orders</h2>
      <div className="accordion accordion-flush shadow rounded border" id="orders-accordion">
        {orders.map((order) => {
          const statusBadgeClass = getStatusBadgeClass(order.status);
          const paymentDeadline = getPaymentDeadline(order);
          return (
            <div className="accordion-item" key={order.id}>
              <h2 className="accordion-header" id={`heading-${order.id}`}>
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${order.id}`} aria-expanded="false" aria-controls={`collapse-${order.id}`}>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div><span className="fw-bold">Order #{order.id}</span></div>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${statusBadgeClass} me-3 d-none d-sm-inline`}>{order.status}</span>
                      <span className="fw-bold">{parseFloat(order.total).toFixed(2)} €</span>
                    </div>
                  </div>
                </button>
              </h2>
              <div id={`collapse-${order.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${order.id}`} data-bs-parent="#orders-accordion">
                <div className="accordion-body p-0">
                  <div className="card-orders shadow border-0 overflow-hidden">
                    <div className="card-body p-0">
                      <div className="row g-0">
                        {/* Card contents are now in separate flex divs to enable stacking on mobile */}
                        <div className="col-lg-6 p-4 border-end border-lg-only">
                          <h5 className="mb-4 text-primary">Order Details</h5>
                          <div className="mb-4 bg-light rounded p-3">
                            <div className="mb-2 d-flex flex-column flex-sm-row">
                              <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "140px" }}>Date:</div>
                              <div className="fw-semibold">{new Date(order.date_created).toLocaleString()}</div>
                            </div>
                            <div className="mb-2 d-flex flex-column flex-sm-row">
                              <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "140px" }}>Status:</div>
                              <div><span className={`badge ${statusBadgeClass}`}>{order.status}</span></div>
                            </div>
                          </div>
                          <h6 className="mb-3 text-primary">Additional Information</h6>
                          <div className="bg-light rounded p-3">
                            <div className="row g-3">
                              <div className="col-12 col-sm-6">
                                {['billing_marina', 'billing_charter', 'billing_boat', 'billing_gate'].map((key) => {
                                  const label = labelMap[key];
                                  const value = order.meta_data.find((m) => m.key === key)?.value;
                                  return value && (
                                    <div className="mb-2" key={key}>
                                      <div className="text-muted mb-1">{label}:</div>
                                      <div className="fw-semibold">{value}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="col-12 col-sm-6">
                                {['billing_delivery_date'].map((key) => {
                                  const label = labelMap[key];
                                  const value = order.meta_data.find((m) => m.key === key)?.value;
                                  return value && (
                                    <div className="mb-2" key={key}>
                                      <div className="text-muted mb-1">{label}:</div>
                                      <div className="fw-semibold">{value}</div>
                                    </div>
                                  );
                                })}
                                {!isCashPayment(order) && (
                                  <div className="mb-2">
                                    <div className="text-muted mb-1">Payment Deadline:</div>
                                    <div className="fw-semibold text-danger">{paymentDeadline}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <h6 className="mt-4 mb-3 text-primary">Products</h6>
                          <div className="bg-light rounded p-3">
                            {order.line_items.map((item) => (
                              <div key={item.id} className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2 pb-2 border-bottom">
                                <div>
                                  <span className="fw-semibold">{item.name}</span>
                                  <span className="text-muted ms-2">× {item.quantity}</span>
                                </div>
                                <div className="mt-1 mt-sm-0">{parseFloat(item.total).toFixed(2)} €</div>
                              </div>
                            ))}
                            <div className="d-flex justify-content-between align-items-center fw-bold pt-2">
                              <div>Total</div>
                              <div>{parseFloat(order.total).toFixed(2)} €</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6 p-4">
                          <h5 className="mb-4 text-primary">Payment Information</h5>
                          <div className="mb-4 bg-light rounded p-3">
                            <div className="mb-2 d-flex flex-column flex-sm-row">
                              <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Payment Method:</div>
                              <div className="fw-semibold">{order.payment_method_title || 'N/A'}</div>
                            </div>
                            <div className="mb-2 d-flex flex-column flex-sm-row">
                              <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Payment Status:</div>
                              <div><span className={`badge ${isPaid(order) ? 'bg-success' : 'bg-warning text-dark'}`}>{isPaid(order) ? 'Paid' : 'Pending'}</span></div>
                            </div>
                          </div>
                          
                          {/* Bank Transfer Display */}
                          {isBankTransfer(order) && !isPaid(order) && (
                            <div className="bg-light rounded p-4 border border-primary-subtle">
                              <h6 className="mb-3 text-primary">Bank Transfer Details</h6>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Recipient:</div>
                                <div className="fw-semibold">Sailor's Feast d.o.o.</div>
                              </div>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>IBAN:</div>
                                <div className="fw-semibold">HR9124020061101222221</div>
                              </div>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Reference Number:</div>
                                <div className="fw-semibold">{order.id}-{new Date(order.date_created).getFullYear()}</div>
                              </div>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Amount:</div>
                                <div className="fw-semibold">{parseFloat(order.total).toFixed(2)} EUR</div>
                              </div>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Please pay by:</div>
                                <div className="fw-semibold text-danger">{paymentDeadline}</div>
                              </div>
                              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
                                <button className="btn btn-outline-primary px-4 mb-2 mb-sm-0" onClick={() => handleCopyBankDetails(order)}>
                                  <i className="bi bi-clipboard me-2"></i> Copy Details
                                </button>
                                <button className="btn btn-primary px-4" onClick={() => handleShowQRCode(order)}>
                                  <i className="bi bi-qr-code me-2"></i> Show QR Code
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Cash Payment Display */}
                          {isCashPayment(order) && (
                            <div className="bg-light rounded p-4 border border-success-subtle">
                              <h6 className="mb-3 text-success">Cash Payment on Delivery</h6>
                              <p>Your order will be paid in cash upon delivery.</p>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Amount to pay:</div>
                                <div className="fw-semibold">{parseFloat(order.total).toFixed(2)} EUR</div>
                              </div>
                              <div className="mb-2 d-flex flex-column flex-sm-row">
                                <div className="text-muted mb-1 mb-sm-0" style={{ minWidth: "160px" }}>Delivery date:</div>
                                <div className="fw-semibold">
                                  {order.meta_data.find(m => m.key === 'billing_delivery_date')?.value || 'Not specified'}
                                </div>
                              </div>
                              <div className="alert alert-info mt-3 mb-0">
                                <p className="mb-0">
                                  <i className="bi bi-info-circle me-2"></i>
                                  Please prepare the exact amount in cash for payment upon delivery.
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {isPaid(order) && !isCashPayment(order) && (
                            <div className="alert alert-success mt-4">
                              <p className="mb-0">Payment has been received. Thank you for your order!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showQRModal && selectedOrder && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">QR Payment Code</h5>
                <button type="button" className="btn-close" onClick={handleCloseQRModal}></button>
              </div>
              <div className="modal-body text-center">
                <div className="qr-code-container bg-white p-3 d-inline-block mb-3">
                  <QRCodeSVG value={formatPaymentData(selectedOrder)} size={200} level="M" includeMargin={true} />
                </div>
                <p className="text-muted">Scan this QR code with your banking app to quickly fill in payment details</p>
                <div className="alert alert-info mt-3">
                  <p className="mb-0">
                    <strong>Order #:</strong> {selectedOrder.id}<br />
                    <strong>Amount:</strong> {parseFloat(selectedOrder.total).toFixed(2)} €<br />
                    <strong>Payment Deadline:</strong> {getPaymentDeadline(selectedOrder)}
                  </p>
                </div>
              </div>
              <div className="modal-footer flex-column flex-sm-row">
                <button className="btn btn-secondary w-100 w-sm-auto mb-2 mb-sm-0" onClick={handleCloseQRModal}>Close</button>
                <button className="btn btn-primary w-100 w-sm-auto" onClick={() => handleCopyBankDetails(selectedOrder)}>Copy Bank Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;