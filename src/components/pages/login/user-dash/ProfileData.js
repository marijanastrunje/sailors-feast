import React from "react";
import "./ProfileData.css";

const ProfileData = ({ billing, setBilling, saveUserData }) => {
  return (
    <div className="col-12 col-md-8 mx-auto mt-5 p-3">
      <h2 className="mb-3">Personal Information</h2>
      <div className="row g-1">
        <div className="col-6">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            id="first_name"
            type="text"
            className="form-control"
            value={billing.first_name}
            onChange={(e) => setBilling((prev) => ({ ...prev, first_name: e.target.value }))}
          />
        </div>

        <div className="col-6">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            id="last_name"
            type="text"
            className="form-control"
            value={billing.last_name}
            onChange={(e) => setBilling((prev) => ({ ...prev, last_name: e.target.value }))}
          />
        </div>

        <div className="col-12">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="text"
            className="form-control"
            value={billing.email}
            disabled
            aria-label="User email address (read-only)"
          />
        </div>

        <div className="col-12">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            id="phone"
            type="text"
            className="form-control"
            value={billing.phone}
            onChange={(e) => setBilling((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="col-6">
          <label htmlFor="marina" className="form-label">Marina</label>
          <input
            id="marina"
            type="text"
            className="form-control"
            value={billing.marina}
            onChange={(e) => setBilling((prev) => ({ ...prev, marina: e.target.value }))}
          />
        </div>

        <div className="col-6">
          <label htmlFor="charter" className="form-label">Charter</label>
          <input
            id="charter"
            type="text"
            className="form-control"
            value={billing.charter}
            onChange={(e) => setBilling((prev) => ({ ...prev, charter: e.target.value }))}
          />
        </div>

        <div className="col-8">
          <label htmlFor="boat" className="form-label">Boat</label>
          <input
            id="boat"
            type="text"
            className="form-control"
            value={billing.boat}
            onChange={(e) => setBilling((prev) => ({ ...prev, boat: e.target.value }))}
          />
        </div>

        <div className="col-4">
          <label htmlFor="gate" className="form-label">Gate</label>
          <input
            id="gate"
            type="text"
            className="form-control"
            value={billing.gate}
            onChange={(e) => setBilling((prev) => ({ ...prev, gate: e.target.value }))}
          />
        </div>
      </div>

      <button className="btn btn-prim mt-3" onClick={saveUserData}>
        Save Changes
      </button>
    </div>
  );
};

export default ProfileData;
