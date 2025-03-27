import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedLists = ({ savedLists, setSavedLists }) => {

const navigate = useNavigate();
  const [selectedList, setSelectedList] = useState(null);
  const token = localStorage.getItem("token");

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

  return (
    <div>
      <h4>Moje spremljene liste</h4>
      <div className="list-group">
        {Object.keys(savedLists).map((listName) => (
          <div key={listName} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <span
                className="fw-bold text-primary"
                onClick={() => setSelectedList(selectedList === listName ? null : listName)}
                style={{ cursor: "pointer" }}
              >
                {listName} {selectedList === listName ? "▲" : "▼"}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => loadListToCart(listName)}
                >
                  Učitaj u košaricu
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteList(listName)}
                >
                  Obriši
                </button>
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
                        <td className="p-0">
                          <img
                            src={item.image?.length > 0 ? item.image[0].src : "https://placehold.co/70"}
                            alt={item.title}
                            width="50"
                          />
                        </td>
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
  );
};

export default SavedLists;
