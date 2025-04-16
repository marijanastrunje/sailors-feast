import React from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SavedLists = ({ savedLists, setSavedLists }) => {
  const navigate = useNavigate();
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
    <div className="container col-md-8 my-5">
      <h2 className="mb-4 text-center">My Saved Lists</h2>

      <style>
        {`
          .accordion-button:not(.collapsed) {
            color: rgb(0, 0, 0);
            background-color: #f2f2f2;
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
          }
          .accordion-button:focus {
            border-color: #ced4da;
            box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25);
          }
          .accordion-button:not(.collapsed)::after {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23495057'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
          }
          .accordion-button:after {
           margin-left: 15px !important;
          } 
        `}
      </style>

      <div className="accordion accordion-flush mt-4 shadow rounded border" id="saved-lists-accordion">
        {Object.keys(savedLists).map((listName, index) => (
          <div 
            className={`accordion-item ${index === 0 ? 'border-top-0' : ''} ${index === Object.keys(savedLists).length - 1 ? 'border-bottom-0' : ''}`} 
            key={listName}
          >
            <h2 className="accordion-header" id={`heading-${index}`}>
            <button className="accordion-button collapsed fw-bold justify-content-between align-items-center" type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${index}`}
              aria-expanded="false"
              aria-controls={`collapse-${index}`}
            >
              <span>{listName}</span>
              <div className="accordion-actions ms-auto d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={(e) => {
                    e.stopPropagation(); // da ne aktivira otvaranje accordeona
                    loadListToCart(listName);
                  }}
                >
                  Cart
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation(); // sprječava collapse
                    deleteList(listName);
                  }}
                >
                  Delete
                </button>
              </div>
            </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#saved-lists-accordion"
            >
              <div className="accordion-body bg-light">
                <table className="table table-bordered table-hover align-middle-cart text-center">
                  <thead className="table-secondary">
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Total</th>
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
                            height="50"
                          />
                        </td>
                        <td className="small">{item.title}</td>
                        <td>{item.quantity}</td>
                        <td className="small">{(item.price * item.quantity).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLists;
