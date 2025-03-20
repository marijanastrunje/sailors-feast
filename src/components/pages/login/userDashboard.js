import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBillingData from "../cart-checkout/useBillingData";

const UserDashboard = () => {
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [billing, setBilling, fetchUserData] = useBillingData(); // Koristi podatke iz useBillingData
    const [savedLists, setSavedLists] = useState({});
    const [selectedList, setSelectedList] = useState(null);

    // Dohvati spremljene liste posebno
    useEffect(() => {
        if (!token) {
            navigate("/login?redirect=/user", { replace: true });
            return;
        }

        fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/users/me?nocache=${Date.now()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.meta && data.meta.saved_lists) {
                setSavedLists(JSON.parse(data.meta.saved_lists));
            }
        })
        .catch(err => console.error("Greška pri dohvaćanju podataka:", err));

        fetchUserData(); // Ponovno dohvaćanje korisničkih podataka
    }, [navigate, token, fetchUserData]);

    // Spremanje korisničkih podataka
    const saveUserData = () => {
        if (!token) {
            alert("Niste prijavljeni!");
            return;
        }

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(billing)
        })
        .then(res => res.json())
        .then(updatedData => {
            if (updatedData.id) {
                alert("Podaci su uspješno ažurirani!");
                fetchUserData(); // Osvježi podatke nakon spremanja
            } else {
                alert("Greška pri spremanju podataka.");
            }
        })
        .catch(err => {
            console.error("Greška pri spremanju podataka:", err);
            alert("Greška pri spremanju podataka.");
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Korisnički profil</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Osobni podaci</h4>
                        <div className="row g-1">
                            <div className="col-6">
                                <label className="form-label">First name</label>
                                <input type="text" name="first_name" className="form-control" value={billing.first_name} onChange={(e) => setBilling(prev => ({ ...prev, first_name: e.target.value }))} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Last name</label>
                                <input type="text" name="last_name" className="form-control" value={billing.last_name} onChange={(e) => setBilling(prev => ({ ...prev, last_name: e.target.value }))} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Email</label>
                                <input type="text" name="email" className="form-control" value={billing.email} disabled />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Phone</label>
                                <input type="text" name="phone" className="form-control" value={billing.phone} onChange={(e) => setBilling(prev => ({ ...prev, phone: e.target.value }))} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Marina</label>
                                <input type="text" className="form-control" value={billing.marina} onChange={e => setBilling({ ...billing, marina: e.target.value })} required />
                            </div>

                            <div className="col-6">
                                <label className="form-label">Charter</label>
                                <input type="text" className="form-control" value={billing.charter} onChange={e => setBilling({ ...billing, charter: e.target.value })} required />
                            </div>

                            <div className="col-8">
                                <label className="form-label">Boat</label>
                                <input type="text" className="form-control" value={billing.boat} onChange={e => setBilling({ ...billing, boat: e.target.value })} required />
                            </div>

                            <div className="col-4">
                                <label className="form-label">Gate</label>
                                <input type="text" className="form-control" value={billing.gate} onChange={e => setBilling({ ...billing, gate: e.target.value })} required />
                            </div>
                        </div>
                        <button className="btn btn-prim mt-3" onClick={saveUserData}>Spremi podatke</button>
                    </div>
                </div>

                {/* Prikaz spremljenih listi */}
                <div className="col-md-8">
                    {Object.keys(savedLists).length > 0 && (
                        <div className="mt-4">
                            <h4>Moje spremljene liste</h4>
                            <div className="list-group">
                                {Object.keys(savedLists).map((listName) => (
                                    <div key={listName} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-primary cursor-pointer" onClick={() => setSelectedList(selectedList === listName ? null : listName)} style={{ cursor: "pointer" }}>
                                                {listName} {selectedList === listName ? "▲" : "▼"}
                                            </span>
                                            <div>
                                                <button className="btn btn-sm btn-success me-2">Učitaj u košaricu</button>
                                                <button className="btn btn-sm btn-danger">Obriši</button>
                                            </div>
                                        </div>

                                        {selectedList === listName && (
                                            <div className="mt-3">
                                                <table className="table table-bordered table-hover text-center">
                                                    <thead className="table-secondary">
                                                        <tr>
                                                            <th>Slika</th>
                                                            <th>Proizvod</th>
                                                            <th>Količina</th>
                                                            <th>Ukupno</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {savedLists[listName].map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="p-0"><img src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} alt={item.title} width="50"  /></td>
                                                                <td>{item.title}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{(item.price * item.quantity).toFixed(2)} €</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
