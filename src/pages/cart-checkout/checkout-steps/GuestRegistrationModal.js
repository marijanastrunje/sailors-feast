import React, { useState } from "react";

const GuestRegistrationModal = ({ show, onClose, onRegister, userInfo, isSubmitting }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError("");
    onRegister(password);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Your Account</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-success">
              <p className="mb-0">Your order has been placed successfully!</p>
            </div>
            
            <p>
              Would you like to create an account to track your orders and save your information for future purchases?
            </p>
            
            <div className="mb-3">
              <strong>Your information:</strong>
              <ul className="list-unstyled ms-3">
                <li><strong>Email:</strong> {userInfo.email}</li>
                <li><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</li>
              </ul>
            </div>
            
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Set Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              No thanks
            </button>
            <button 
              type="button" 
              className="btn btn-prim" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistrationModal;