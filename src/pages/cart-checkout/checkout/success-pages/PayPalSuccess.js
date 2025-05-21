import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PayPalSuccess = ({ isGuestCheckout, hasAccount, onShowRegistrationModal }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [copied, setCopied] = useState(false);
    
    // Fallback provjere ako propovi nisu prosljeđeni
    const isGuest = isGuestCheckout ?? (sessionStorage.getItem("guest_checkout") === "true");
    const userHasAccount = hasAccount ?? !!localStorage.getItem("token");

    useEffect(() => {
        if (!orderId) {
            setError("No order ID found.");
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`${backendUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${process.env.REACT_APP_WC_KEY}&consumer_secret=${process.env.REACT_APP_WC_SECRET}`);
                const data = await response.json();

                setOrderDetails({
                    email: data.billing.email,
                    total: data.total
                });

                localStorage.removeItem("cart");
                localStorage.removeItem("lastOrderId");
                window.dispatchEvent(new Event("cartUpdated"));

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
                setError("Error loading your order details.");
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Funkcija za kopiranje broja narudžbe
    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className="container">
            <div className="payment-confirmation py-4">
                <div className="text-center mb-4">
                    <div className="icon-container mb-3">
                        <i className="fas fa-check-circle text-success" style={{ fontSize: '48px' }}></i>
                    </div>
                    <h2>Thank you for your order!</h2>
                    <p className="lead">Your payment has been successfully processed.</p>
                    {orderDetails?.email && (
                        <p>A confirmation email with all order details has been sent to <strong>{orderDetails.email}</strong></p>
                    )}
                </div>

                {loading && (
                    <div className="text-center">
                        <p>Loading order details...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center">
                        <strong>{error}</strong>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card mb-4">
                                    <div className="card-header bg-sec text-white">
                                        <h3 className="card-title h5 mb-0">Order Details</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <strong>Order Number:</strong> {orderId}
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={handleCopyOrderId}
                                            >
                                                {copied ? "✓ Copied" : "Copy"}
                                            </button>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <strong>Payment Method:</strong>
                                                <br />
                                                <span className="text-muted">PayPal</span>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Status:</strong>
                                                <br />
                                                <span className="badge bg-success">Payment Completed</span>
                                            </div>
                                        </div>
                                        
                                        {orderDetails?.total && (
                                            <div className="mt-3">
                                                <strong>Total:</strong> €{orderDetails.total}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            {isGuest ? (
                                userHasAccount ? (
                                    <>
                                        <p className="text-success mb-3">Your account has been created and you're now logged in.</p>
                                        <button onClick={() => navigate("/user")} className="btn btn-prim me-2">
                                            View Your Orders
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-3">Want to track your order and save time on future purchases?</p>
                                        <button
                                            onClick={() => {
                                                if (onShowRegistrationModal) {
                                                    onShowRegistrationModal();
                                                } else {
                                                    // Fallback ako modal funkcija nije dostupna
                                                    navigate("/register", {
                                                        state: {
                                                            email: orderDetails?.email,
                                                            fromOrder: true
                                                        }
                                                    });
                                                }
                                            }}
                                            className="btn btn-prim me-2"
                                        >
                                            Create Account
                                        </button>
                                    </>
                                )
                            ) : (
                                <button onClick={() => navigate("/user")} className="btn btn-prim me-2">
                                    View Your Orders
                                </button>
                            )}
                            <Link to="/groceries" className="btn btn-outline-secondary ms-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PayPalSuccess;