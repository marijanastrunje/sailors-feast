import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        email:"",
        phone: "",
        marina: "",
        charter: "",
        boat: "",
        gate: "",
    });

    const [savedLists, setSavedLists] = useState({});
    const [selectedList, setSelectedList] = useState(null);
    const token = localStorage.getItem("token");

    // Dohvati korisničke podatke
    const fetchUserData = useCallback(() => {
        if (!token) return;

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error("Greška pri dohvaćanju podataka.");
            return res.json();
        })
        .then(data => {
            console.log("Podaci s backenda:", data); 
            if (data.id) {
                setUserData({
                    first_name: data.first_name ?? "",
                    last_name: data.last_name ?? "",
                    email: data.name ?? "",
                    phone: data.phone ?? "",
                    marina: data.marina ?? "",
                    charter: data.charter ?? "",
                    boat: data.boat ?? "",
                    gate: data.gate ?? "",
                });
                if (data.meta && data.meta.saved_lists) {
                    setSavedLists(JSON.parse(data.meta.saved_lists));
                }
            }
        })
        .catch(err => console.error("Greška pri dohvaćanju podataka:", err));
    }, [token]);

    // Učitavanje korisničkih podataka prilikom dolaska na stranicu
    useEffect(() => {
        if (!token) {
            navigate("/login?redirect=/user", { replace: true });
            return;
        }
        fetchUserData();
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
            body: JSON.stringify(userData)
        })
        .then(res => {
            if (!res.ok) throw new Error("Greška pri spremanju podataka.");
            return res.json();
        })
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

    // Učitaj listu u košaricu
    const loadListToCart = (listName) => {
        const list = savedLists[listName];
        if (!list) return;

        localStorage.setItem("cart", JSON.stringify(list));
        window.dispatchEvent(new Event("cartUpdated"));
        alert(`Lista "${listName}" je učitana u košaricu!`);
        navigate("/cart");
    };

    // Obriši spremljenu listu s backenda
    const deleteList = (listName) => {
        const updatedLists = { ...savedLists };
        delete updatedLists[listName];

        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ meta: { saved_lists: JSON.stringify(updatedLists) } })
        })
        .then(res => res.json())
        .then(() => {
            setSavedLists(updatedLists);
            alert(`Lista "${listName}" je obrisana.`);
        })
        .catch(err => {
            console.error("Greška pri brisanju liste:", err);
            alert("Nije moguće obrisati listu.");
        });
    };

    // Prikaži ili sakrij proizvode unutar liste
    const toggleListView = (listName) => {
        setSelectedList(selectedList === listName ? null : listName);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Korisnički profil</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-4">
                        <h4>Osobni podaci</h4>
                        <div className="row">
                            {["first_name", "last_name", "email", "phone", "marina", "charter", "boat", "gate"].map((field, index) => (
                                <div key={index} className="col-md-6">
                                    <label className="form-label">{field.replace("_", " ").toUpperCase()}</label>
                                    <input 
                                        type="text" 
                                        name={field} 
                                        className="form-control" 
                                        value={userData[field]} 
                                        onChange={(e) => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }))} 
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary mt-3" onClick={saveUserData}>Spremi podatke</button>
                    </div>
                </div>
                <div className="col-md-8">    
                    {Object.keys(savedLists).length > 0 && (
                        <div className="mt-4">
                            <h4>Moje spremljene liste</h4>
                            <div className="list-group">
                                {Object.keys(savedLists).map((listName) => (
                                    <div key={listName} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span 
                                                className="fw-bold text-primary cursor-pointer"
                                                onClick={() => toggleListView(listName)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {listName} {selectedList === listName ? "▲" : "▼"}
                                            </span>
                                            <div>
                                                <button className="btn btn-sm btn-success me-2" onClick={() => loadListToCart(listName)}>Učitaj u košaricu</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteList(listName)}>Obriši</button>
                                            </div>
                                        </div>

                                        {/* Prikaz proizvoda unutar liste */}
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
                                                                <td className="p-0">
                                                                    <img 
                                                                        src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"} 
                                                                        alt={item.title} 
                                                                        width="50" 
                                                                    />
                                                                </td>
                                                                <td>{item.title} <br /> {item.price} €</td>
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
