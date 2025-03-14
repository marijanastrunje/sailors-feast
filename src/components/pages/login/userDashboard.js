import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address_1: "",
        city: "",
        marina: "",
        charter: "",
        boat: "",
        gate: "",
        delivery_date: "",
        delivery_time: "",
    });

    const [savedLists, setSavedLists] = useState({});
    const [selectedList, setSelectedList] = useState(null);

    // Dohvati podatke korisnika i liste iz localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login?redirect=/user");
        }

        // Dohvati spremljene podatke korisnika
        const savedUserData = JSON.parse(localStorage.getItem("user")) || {};
        setUserData(savedUserData);

        // Dohvati spremljene liste
        const lists = JSON.parse(localStorage.getItem("savedLists")) || {};
        setSavedLists(lists);
    }, [navigate]);

    // Funkcija za spremanje korisničkih podataka u localStorage
    const saveUserData = () => {
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Podaci su spremljeni!");
    };

    // Funkcija za unos podataka u state
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
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

    // Obriši spremljenu listu
    const deleteList = (listName) => {
        const updatedLists = { ...savedLists };
        delete updatedLists[listName];

        setSavedLists(updatedLists);
        localStorage.setItem("savedLists", JSON.stringify(updatedLists));
        alert(`Lista "${listName}" je obrisana.`);
    };

    // Prikaži ili sakrij proizvode unutar liste
    const toggleListView = (listName) => {
        setSelectedList(selectedList === listName ? null : listName);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Korisnički profil</h2>

            {/* Forma za unos korisničkih podataka */}
            <div className="card p-4 mb-5">
                <h4>Osobni podaci</h4>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">Ime</label>
                        <input type="text" name="first_name" className="form-control" value={userData.first_name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Prezime</label>
                        <input type="text" name="last_name" className="form-control" value={userData.last_name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={userData.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Telefon</label>
                        <input type="text" name="phone" className="form-control" value={userData.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Marina</label>
                        <input type="text" name="marina" className="form-control" value={userData.marina} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Charter</label>
                        <input type="text" name="charter" className="form-control" value={userData.charter} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Brod</label>
                        <input type="text" name="boat" className="form-control" value={userData.boat} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Gate</label>
                        <input type="text" name="gate" className="form-control" value={userData.gate} onChange={handleChange} />
                    </div>
                </div>
                <button className="btn btn-primary mt-3" onClick={saveUserData}>Spremi podatke</button>
            </div>

            <h3 className="mt-5">Spremljene liste</h3>
            {Object.keys(savedLists).length > 0 ? (
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

                            {/* Prikaz proizvoda unutar odabrane liste */}
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
            ) : (
                <p className="text-center">Nema spremljenih lista.</p>
            )}
        </div>
    );
};

export default UserDashboard;
