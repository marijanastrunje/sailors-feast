import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SavedLists = ({ savedLists, setSavedLists }) => {
  const navigate = useNavigate();
  const [selectedList, setSelectedList] = useState(null);
  const token = localStorage.getItem("token");

  const loadListToCart = (listName) => {
    const list = savedLists[listName];
    if (!list) return;

    localStorage.setItem("cart", JSON.stringify(list));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`List "${listName}" has been loaded into your cart!`);
    navigate("/cart");
  };

  const deleteList = (listName) => {
    const updatedLists = { ...savedLists };
    delete updatedLists[listName];

    fetch(`${backendUrl}/wp-json/wp/v2/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ meta: { saved_lists: JSON.stringify(updatedLists) } })
    })
      .then((res) => res.json())
      .then(() => {
        setSavedLists(updatedLists);
        alert(`List "${listName}" was successfully deleted.`);
      })
      .catch((err) => {
        console.error("Error deleting list:", err);
        alert("Unable to delete list.");
      });
  };

  return (
    <div>
      <h4 className="mb-3">My Saved Lists</h4>
      <div className="list-group">
        {Object.keys(savedLists).map((listName) => (
          <div key={listName} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-link fw-bold text-primary p-0"
                onClick={() =>
                  setSelectedList(selectedList === listName ? null : listName)
                }
                aria-expanded={selectedList === listName}
                aria-controls={`list-${listName}`}
              >
                {listName} {selectedList === listName ? "▲" : "▼"}
              </button>
              <div>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => loadListToCart(listName)}
                >
                  Load to Cart
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteList(listName)}
                >
                  Delete
                </button>
              </div>
            </div>

            {selectedList === listName && (
              <div className="mt-3" id={`list-${listName}`}>
                <table className="table table-bordered table-hover text-center">
                  <thead className="table-secondary">
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedLists[listName].map((item) => (
                      <tr key={item.id}>
                        <td className="p-0">
                          <img
                            src={
                              item.image?.length > 0
                                ? item.image[0].src
                                : "https://placehold.co/70"
                            }
                            alt={item.title}
                            width="50"
                            height="50"
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
