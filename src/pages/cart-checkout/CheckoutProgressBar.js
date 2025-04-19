import React from "react";

const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Personal Details" },
    { id: 2, name: "Delivery Details" },
    { id: 3, name: "Payment" }
  ];

  // Calculate progress percentage for progress bar
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="checkout-progress-container mb-4">
      {/* Progress Bar */}
      <div className="progress mx-3 ms-sm-5 mb-3" style={{ height: "4px" }}>
        <div
          className="progress-bar bg-prim"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="d-flex justify-content-between">
        {steps.map((step) => (
          <div key={step.id} className="text-center position-relative">
            <div
              className={`step-indicator rounded-circle d-flex align-items-center justify-content-center mb-1 mx-auto ${
                currentStep >= step.id ? "active-step" : ""
              }`}
            >
              <span>{step.id}</span>
            </div>
            <div className={`step-name ${currentStep >= step.id ? "text-prim fw-bold" : "text-muted"}`}>
              <span className="d-none d-sm-inline">{step.name}</span>
              <span className="d-sm-none">{step.name.split(" ")[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgressBar;