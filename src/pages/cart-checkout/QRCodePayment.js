import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePayment = ({ qrData, orderId }) => {
  const [copied, setCopied] = useState(false);

  // Format payment data for Croatian payment slip format (HUB3A)
  const formatPaymentData = () => {
    const amount = qrData.amount.toFixed(2);
  
    const recipient = "Sailor's Feast d.o.o.";
    const recipientAddress = "Ivana Meštrovića 35, 10000 Zagreb";
    const recipientIBAN = "HR9124020061101222221";
    const model = "HR01";
    const reference = `${orderId}-${new Date().getFullYear()}`;
    const description = `Order #${orderId}`;
  
    return `HRVHUB30
  EUR
  ${amount}
  ${qrData.customerName}
  .
  .
  ${recipient}
  ${recipientAddress}
  ${recipientIBAN}
  ${model}
  ${reference}
  COST
  ${description}
  `;
  };
  

  const handleCopyBankDetails = () => {
    const bankDetails = `
      Recipient: Sailor's Feast d.o.o.
      IBAN: HR9124020061101222221
      Reference number: ${orderId}-${new Date().getFullYear()}
      Amount: ${qrData.amount.toFixed(2)} EUR
      Description: Order #${orderId}
    `;
    
    navigator.clipboard.writeText(bankDetails.trim());
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const paymentDeadline = () => {
    if (qrData.deliveryDate) {
      const deliveryDate = new Date(qrData.deliveryDate);
      const deadline = new Date(deliveryDate);
      deadline.setDate(deliveryDate.getDate() - 7);
      return deadline.toLocaleDateString();
    }
    return "Not specified";
  };

  return (
    <div className="payment-confirmation py-4">
      <div className="text-center mb-4">
        <div className="icon-container mb-3">
          <i className="fas fa-check-circle text-success" style={{ fontSize: '48px' }}></i>
        </div>
        <h2>Your Order Has Been Placed!</h2>
        <p className="lead">Order #<strong>{orderId}</strong></p>
        <p>A confirmation email with all order details has been sent to <strong>{qrData.email}</strong></p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title h5 mb-0">Bank Transfer Information</h3>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Recipient:</strong> Sailor's Feast d.o.o.</p>
              <p className="mb-1"><strong>IBAN:</strong> HR9124020061101222221</p>
              <p className="mb-1"><strong>Reference number:</strong> {orderId}-{new Date().getFullYear()}</p>
              <p className="mb-1"><strong>Amount:</strong> {qrData.amount.toFixed(2)} EUR</p>
              <p className="mb-1"><strong>Description:</strong> Order #{orderId}</p>
              
              {qrData.deliveryDate && (
                <div className="alert alert-warning mt-3">
                  <p className="mb-0">
                    <strong>Payment Deadline:</strong> {paymentDeadline()}
                  </p>
                  <small>Payment must be received 7 days before delivery date</small>
                </div>
              )}
              
              <button
                className="btn btn-outline-primary mt-3"
                onClick={handleCopyBankDetails}
              >
                {copied ? "✓ Copied" : "Copy Bank Details"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title h5 mb-0">Scan QR Code to Pay</h3>
            </div>
            <div className="card-body text-center">
              <div className="qr-code-container bg-white p-3 d-inline-block mb-3">
                <QRCodeSVG 
                  value={formatPaymentData()} 
                  size={200} 
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-muted">
                Scan this QR code with your banking app to quickly fill in payment details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/user" className="btn btn-prim me-3">
          View Your Orders
        </Link>
        <Link to="/" className="btn btn-outline-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default QRCodePayment;