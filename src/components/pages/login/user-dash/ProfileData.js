import React from "react";
import './ProfileData.css'

const ProfileData = ({ billing, setBilling, saveUserData }) => {
  return (
    <div className="col-12 col-md-6 offset-md-1 p-3">
      <h4>Osobni podaci</h4>
      <div className="row g-1">
        <div className="col-6">
          <label className="form-label">First name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={billing.first_name}
            onChange={(e) => setBilling(prev => ({ ...prev, first_name: e.target.value }))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Last name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={billing.last_name}
            onChange={(e) => setBilling(prev => ({ ...prev, last_name: e.target.value }))}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Email</label>
          <input type="text" name="email" className="form-control" value={billing.email} disabled />
        </div>
        <div className="col-12">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={billing.phone}
            onChange={(e) => setBilling(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Marina</label>
          <input
            type="text"
            className="form-control"
            value={billing.marina}
            onChange={e => setBilling({ ...billing, marina: e.target.value })}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Charter</label>
          <input
            type="text"
            className="form-control"
            value={billing.charter}
            onChange={e => setBilling({ ...billing, charter: e.target.value })}
          />
        </div>
        <div className="col-8">
          <label className="form-label">Boat</label>
          <input
            type="text"
            className="form-control"
            value={billing.boat}
            onChange={e => setBilling({ ...billing, boat: e.target.value })}
          />
        </div>
        <div className="col-4">
          <label className="form-label">Gate</label>
          <input
            type="text"
            className="form-control"
            value={billing.gate}
            onChange={e => setBilling({ ...billing, gate: e.target.value })}
          />
        </div>
      </div>
      <button className="btn btn-prim mt-3" onClick={saveUserData}>Spremi podatke</button>
    </div>
  );
};

export default ProfileData;
