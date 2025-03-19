import React from "react";

const BillingForm = ({ billing, setBilling, handlePayment }) => {
    return (
        <>
            <h4 className="mb-3">Billing details</h4>
            <form className="needs-validation">
                <div className="row g-3">
                    <div className="col-6">
                        <label className="form-label">First name</label>
                        <input type="text" className="form-control" value={billing.first_name} onChange={e => setBilling({ ...billing, first_name: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Last name</label>
                        <input type="text" className="form-control" value={billing.last_name} onChange={e => setBilling({ ...billing, last_name: e.target.value })} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={billing.email} onChange={e => setBilling({ ...billing, email: e.target.value })} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" value={billing.phone} onChange={e => setBilling({ ...billing, phone: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Marina</label>
                        <input type="text" className="form-control" value={billing.marina} onChange={e => setBilling({ ...billing, marina: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Charter</label>
                        <input type="text" className="form-control" value={billing.charter} onChange={e => setBilling({ ...billing, charter: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Boat</label>
                        <input type="text" className="form-control" value={billing.boat} onChange={e => setBilling({ ...billing, boat: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Gate</label>
                        <input type="text" className="form-control" value={billing.gate} onChange={e => setBilling({ ...billing, gate: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Preferred delivery date</label>
                        <input type="date" className="form-control" value={billing.delivery_date} onChange={e => setBilling({ ...billing, delivery_date: e.target.value })} required />
                    </div>

                    <div className="col-6">
                        <label className="form-label">Preferred delivery time</label>
                        <input type="time" className="form-control" value={billing.delivery_time} onChange={e => setBilling({ ...billing, delivery_time: e.target.value })} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Order notes</label>
                        <textarea className="form-control" value={billing.order_notes} onChange={e => setBilling({ ...billing, order_notes: e.target.value })}></textarea>
                    </div>
                </div>
                <hr className="my-4" />
                <button className="w-100 btn btn-primary btn-lg" type="button" onClick={handlePayment}>Plati s Viva Wallet</button>
            </form>
        </>
    );
};

export default BillingForm;
