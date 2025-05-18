import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DeliveryDetailsStep = ({ 
  billing, 
  setBilling, 
  nextStep, 
  prevStep, 
  isSubmitting,
  errors = {},
  setValidationErrors,
  showWarning = false,
  setShowDeliveryWarning,
  checkDeliveryDateWarning,
  setHasCheckedDeliveryDate
}) => {
  // State to store available time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  // Loading state for time slots
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // All available marinas
  const availableMarinas = [
    "Marina Kaštela",
    "Marina Trogir (SCT)",
    "Marina Baotić",
    "Marina Kremik",
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setBilling((prev) => ({ ...prev, [name]: value }));

    // When delivery date or marina changes, fetch available time slots
    if ((name === "delivery_date" && value) || (name === "marina" && value)) {
      if (billing.delivery_date && (name === "marina" || billing.marina)) {
        fetchAvailableTimeSlots(name === "delivery_date" ? value : billing.delivery_date, name === "marina" ? value : billing.marina);
      }

      // Check if date is changing
      if (name === "delivery_date" && value) {
        const needsWarning = checkDeliveryDateWarning(value);
        setShowDeliveryWarning(needsWarning);
        setHasCheckedDeliveryDate(true);

        if (!needsWarning) {
          setValidationErrors(prev => {
            const updated = { ...prev };
            ["charter", "boat", "gate"].forEach(field => {
              delete updated[field];
            });
            return updated;
          });
        }
      }
    }
  };

  // Function to fetch available time slots based on delivery date and marina
  const fetchAvailableTimeSlots = useCallback(async (date, marina) => {
    if (!date || !marina) return;
    
    setLoadingTimeSlots(true);
    try {
      const response = await fetch(`${backendUrl}/wp-json/wc-delivery/v1/available-slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delivery_date: date, marina: marina }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAvailableTimeSlots(data.available_slots || []);
        if (billing.delivery_time && !data.available_slots.includes(billing.delivery_time)) {
          setBilling(prev => ({ ...prev, delivery_time: '' }));
        }
      } else {
        console.error('Error fetching time slots:', data.message);
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  }, [billing.delivery_time, setBilling]);
  
  
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // resetiramo vrijeme na 00:00
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 4); // dodamo 4 dana
    return minDate.toISOString().split("T")[0];
  };

  const minDeliveryDate = getMinDate();
  
  // Formatiranje datuma za prikaz u pomoćnom tekstu
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Update delivery warning and fetch time slots when component mounts or relevant fields change
  useEffect(() => {
    if (billing.delivery_date) {
      const needsWarning = checkDeliveryDateWarning(billing.delivery_date);
      setShowDeliveryWarning(needsWarning);
      
      // Fetch available time slots if both date and marina are selected
      if (billing.marina) {
        fetchAvailableTimeSlots(billing.delivery_date, billing.marina);
      }
    }
  }, [billing.delivery_date, billing.marina, checkDeliveryDateWarning, setShowDeliveryWarning, fetchAvailableTimeSlots]);
  
  // Dobivanje današnjeg datuma za prikaz
  const today = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="checkout-step">
      <h4 className="mb-3">
        Delivery details
        {!showWarning && (
          <span className="optional-label"></span>
        )}
      </h4>

      {showWarning && (
        <div className="alert alert-warning mb-3 d-flex align-items-start" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2 mt-1" />
          <span>
            <strong>Important:</strong> Your delivery date is less than 7 days away. Delivery details are required.
          </span>
        </div>
      )}

      {!showWarning && billing.delivery_date && (
        <div className="alert alert-info mb-3 d-flex align-items-start" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2 mt-1" />
          <span>
            Delivery details are optional when ordering more than 7 days in advance. However, 
            you must provide these details at least 7 days before your delivery date.
          </span>
        </div>
      )}

      <form className="needs-validation">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="delivery_date" className="form-label d-flex justify-content-between align-items-center">
              <span>
                Preferred delivery date 
                <span className="text-danger ms-1">*</span>
              </span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.delivery_date ? 'is-invalid' : ''}`}
              id="delivery_date"
              name="delivery_date"
              value={billing.delivery_date || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              min={minDeliveryDate}
              required
            />
            <small className="form-text text-muted">
              Today is {today}. Earliest delivery date is {formatDateForDisplay(minDeliveryDate)} (3 days from today).
            </small>
            {errors.delivery_date && (
              <div className="invalid-feedback">{errors.delivery_date}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="marina" className="form-label">
              Marina
              <span className="text-danger ms-1">*</span>
            </label>
            <select
              className={`form-select ${errors.marina ? 'is-invalid' : ''}`}
              id="marina"
              name="marina"
              value={billing.marina || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select a marina</option>
              {availableMarinas.map((marina) => (
                <option key={marina} value={marina}>{marina}</option>
              ))}
            </select>
            {errors.marina && (
              <div className="invalid-feedback">{errors.marina}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="delivery_time" className="form-label">
              Preferred delivery time
              <span className="text-danger ms-1">*</span>
            </label>
            <select
              className={`form-select ${errors.delivery_time ? 'is-invalid' : ''}`}
              id="delivery_time"
              name="delivery_time"
              value={billing.delivery_time || ''}
              onChange={handleChange}
              disabled={isSubmitting || loadingTimeSlots || !billing.marina || !billing.delivery_date}
              required
            >
              <option value="">Select time slot</option>
              {loadingTimeSlots ? (
                <option value="" disabled>Loading available time slots...</option>
              ) : (
                availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))
              )}
            </select>
            {billing.delivery_date && billing.marina && (
            <small className="form-text text-muted">
              You can see only available time slots.
            </small>
            )}
            {!billing.marina && (
              <small className="form-text text-muted">
                Please select a marina to see available time slots.
              </small>
            )}
            {!billing.delivery_date && billing.marina && (
              <small className="form-text text-muted">
                Please select a delivery date to see available time slots
              </small>
            )}
            {billing.marina && billing.delivery_date && availableTimeSlots.length === 0 && !loadingTimeSlots && (
              <small className="form-text text-muted">
                No time slots available for this date and marina
              </small>
            )}
            {errors.delivery_time && (
              <div className="invalid-feedback">{errors.delivery_time}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="charter" className="form-label">
              Charter
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${(showWarning && errors.charter) ? 'is-invalid' : ''}`}
              id="charter"
              name="charter"
              value={billing.charter || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Croatia Yachting"
              required={showWarning}
            />
            {errors.charter && (
              <div className="invalid-feedback">{errors.charter}</div>
            )}
          </div>

          <div className="col-md-8">
            <label htmlFor="boat" className="form-label">
              Boat
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.boat ? 'is-invalid' : ''}`}
              id="boat"
              name="boat"
              value={billing.boat || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Bavaria 46 'Sea Dream'"
              required={showWarning}
            />
            {errors.boat && (
              <div className="invalid-feedback">{errors.boat}</div>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="gate" className="form-label">
              Gate/Pier
              {showWarning && <span className="text-danger ms-1">*</span>}
              {!showWarning && <span className="optional-label">(optional)</span>}
            </label>
            <input
              type="text"
              className={`form-control ${errors.gate ? 'is-invalid' : ''}`}
              id="gate"
              name="gate"
              value={billing.gate || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Gate B"
              required={showWarning}
            />
            {errors.gate && (
              <div className="invalid-feedback">{errors.gate}</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="order_notes" className="form-label">
              Order notes <span className="optional-label">(optional)</span>
            </label>
            <textarea
              className="form-control"
              id="order_notes"
              name="order_notes"
              value={billing.order_notes || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="If you need anything else or have any questions, feel free to write to us here."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="step-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Back to personal details
          </button>
          <button
            type="button"
            className="btn btn-prim"
            onClick={() => {
              if (!billing.delivery_date) {
                alert("Please select a delivery date.");
                return;
              }
              if (!billing.marina) {
                alert("Please select a marina.");
                return;
              }
              if (!billing.delivery_time) {
                alert("Please select a delivery time.");
                return;
              }
              nextStep();
            }}            
            disabled={isSubmitting}
          >
            Continue to payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryDetailsStep;