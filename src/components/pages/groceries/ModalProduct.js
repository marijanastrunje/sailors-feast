import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ModalProduct = ({selectedProduct}) => {
    return (
        <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="productModalLabel">
                        {selectedProduct ? selectedProduct.name : 'Loading...'}
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        {selectedProduct ? (
                        <>
                            <img src={selectedProduct.images.length > 0 ? selectedProduct.images[0].src : "https://placehold.co/160"} width={150} height={180} className="mb-3" alt={selectedProduct.name} />
                            <p><strong>Cijena:</strong> {selectedProduct.price} €</p>
                            <p dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                        </>
                        ) : (
                        <p>Učitavanje podataka...</p>
                        )}
                    </div>
                    <div className="modal-footer d-flex align-items-center p-2">
                        <button className="quantity-btn">-</button>
                        <input type="number" readOnly className="quantity-input" />
                        <button className="quantity-btn">+</button>
                        <button className="btn btn-secondary ms-2">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}  
export default ModalProduct;