import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        marina: "",
        charter: "",
        boat: "",
        gate: "",
    });

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
            if (data.id) {
                setUserData({
                    first_name: data.first_name ?? "",
                    last_name: data.last_name ?? "",
                    phone: data.phone ?? "",
                    marina: data.marina ?? "",
                    charter: data.charter ?? "",
                    boat: data.boat ?? "",
                    gate: data.gate ?? "",
                });
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

    // Spremanje podataka
    const saveUserData = () => {
        if (!token) {
            alert("Niste prijavljeni!");
            return;
        }
    
        console.log("Podaci prije slanja:", userData); // Debugging
    
        fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
        .then(res => {
            console.log("Odgovor servera (status):", res.status);
            if (!res.ok) throw new Error("Greška pri spremanju podataka.");
            return res.json();
        })
        .then(updatedData => {
            console.log("Odgovor s backenda:", updatedData);
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

            <div className="card p-4">
                <h4>Osobni podaci</h4>
                <div className="row">
                    {["first_name", "last_name", "phone", "marina", "charter", "boat", "gate"].map((field, index) => (
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
    );
};

export default UserDashboard;
