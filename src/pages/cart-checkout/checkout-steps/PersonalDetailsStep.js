import React from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PersonalDetailsStep = ({ billing, setBilling, errors = {}, nextStep, isSubmitting }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePhoneChange = (value, country) => {
    setBilling((prev) => ({ 
      ...prev, 
      phone: value,
      country_code: `+${country.dialCode}`
    }));
  };

  return (
    <div className="checkout-step">
      <h4 className="mb-3">Personal Details</h4>
      <form className="needs-validation">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
              id="first_name"
              name="first_name"
              value={billing.first_name || ''}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <div className="error-feedback">{errors.first_name}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
              id="last_name"
              name="last_name"
              value={billing.last_name || ''}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <div className="error-feedback">{errors.last_name}</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={billing.email || ''}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="error-feedback">{errors.email}</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="phone" className="form-label">Phone</label>
            <PhoneInput
              country={'hr'}
              autoFormat={false}
              value={billing.phone || ''}
              onChange={handlePhoneChange}
              placeholder=""
              inputProps={{
                name: 'phone',
                required: true,
                disabled: isSubmitting,
                autoComplete: 'tel',
              }}
              containerClass="phone-input-container w-100"
              inputClass={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              buttonClass="custom-flag-button"
              dropdownClass="custom-dropdown"
            />

            {errors.phone && (
              <div className="error-feedback">{errors.phone}</div>
            )}
            <small className="form-text text-muted">
              We'll only use this to contact you about your delivery if needed.
            </small>
          </div>

          
          <div className="col-12">
            <label htmlFor="number_of_guests" className="form-label">
              Number of Guests <span className="optional-label">(optional)</span>
            </label>
            <input
              type="number"
              className="form-control"
              id="number_of_guests"
              name="number_of_guests"
              value={billing.number_of_guests || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="step-navigation">
          <div></div> {/* Empty div to maintain flex spacing */}
          <button
            type="button"
            className="btn btn-prim"
            onClick={nextStep}
            disabled={isSubmitting}
          >
            Continue to Delivery Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsStep;