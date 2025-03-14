import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ModalProduct = ({ product, onClose }) => {
    if (!product) return null; // Ako nema proizvoda, ne prikazuj modal

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{product.name}</h1>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <img 
                            src={product.images.length > 0 ? product.images[0].src : "https://placehold.co/160"} 
                            width={150} 
                            height={180} 
                            className="mb-3" 
                            alt={product.name} 
                        />
                        <p><strong>Cijena:</strong> {product.price} €</p>
                        <p dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Zatvori</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalProduct;
