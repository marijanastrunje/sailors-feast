import React, { useState, useEffect } from "react";

const BoxProductTable = ({ subcategories, subcategoryProducts, onShowProductModal, handleRemoveProduct, handleShowModal, categoryMapping, title, description, image
}) => {
  // State za praćenje količina proizvoda u paketu
  const [productQuantities, setProductQuantities] = useState({});

  // Postavljamo početne količine na 1 kada se komponenta učita
  useEffect(() => {
    const initialQuantities = {};
    subcategories.forEach((subcategory) => {
      subcategoryProducts[subcategory.id]?.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
    });
    setProductQuantities(initialQuantities);
  }, [subcategories, subcategoryProducts]);

  // Funkcija za promjenu količine proizvoda
  const handleQuantityChange = (productId, newQuantity) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  // Računanje ukupne cijene paketa (SUM)
  const totalSum = subcategories.reduce((sum, subcategory) => {
    return ( sum +
      (subcategoryProducts[subcategory.id]?.reduce((subSum, product) => {
        return subSum + (product.price * (productQuantities[product.id] || 0));
      }, 0) || 0)
    );
  }, 0);

  // Funkcija za dodavanje proizvoda u košaricu
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Pronađemo ID-eve proizvoda koji su trenutno u tablici na "Box Page"
    const currentBoxProductIds = new Set();
    subcategories.forEach((subcategory) => {
        subcategoryProducts[subcategory.id]?.forEach((product) => {
            currentBoxProductIds.add(product.id);
        });
    });

    // Filtriramo košaricu:
    // - Proizvodi koji NISU iz "Box Page" (nemaju `box: true`) ostaju netaknuti.
    // - Proizvodi iz "Box Page" koji više nisu u tablici se brišu.
    cart = cart.filter((item) => !item.box || currentBoxProductIds.has(item.id));

    // Ažuriramo ili dodajemo proizvode iz "Box Page"
    subcategories.forEach((subcategory) => {
        subcategoryProducts[subcategory.id]?.forEach((product) => {
            const quantity = productQuantities[product.id] || 0;

            if (quantity > 0) {
                const existingProduct = cart.find((item) => item.id === product.id);
                if (existingProduct) {
                    // Ako već postoji u košarici, samo ažuriramo količinu
                    existingProduct.quantity = quantity;
                } else {
                    // Ako ne postoji, dodajemo ga s oznakom `box: true`
                    cart.push({
                        id: product.id,
                        image: product.images,
                        title: product.name,
                        price: product.price,
                        quantity: quantity,
                        box: true, // Ovim označavamo da je iz "Box Page"
                    });
                }
            }
        });
    });

    // Spremimo ažuriranu košaricu u localStorage i obavijestimo komponente
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Ažurira prikaz košarice
  };


  return (
    <>
    <div className="container p-3 p-md-5">
      <div className="row">
        <div className="col-md-6">
          <img src={image} alt={title} title={title} className="img-fluid" />
        </div>
        <div className="col-md-6 text-center text-md-start">
          <h1 className="mb-2 mb-md-4 mt-2">{title}</h1>
          <p>{description}</p>
          <h3>SUM: {totalSum.toFixed(2)}€<span className="text-muted">VAT is included</span></h3>
          <button className="btn btn-l" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-lg-6 mx-auto mt-3">
          <table className="table box-products">
            <thead>
              <tr>
                <th colSpan="4"><h2 className="text-center mb-0">Product List</h2></th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <React.Fragment key={subcategory.id}>
                  <tr>
                    <td colSpan="4" className="table-secondary">
                      <div className="d-flex justify-content-center fw-bold">
                        <h3 className="mb-0 me-2">{subcategory.name}</h3>
                        <button className="add-products-button ms-auto ms-sm-0 me-0" onClick={() => handleShowModal(categoryMapping[subcategory.id])}>
                          Add more products
                        </button>
                      </div>
                    </td>
                  </tr>

                  {subcategoryProducts[subcategory.id]?.map((product) => (
                    <tr key={product.id}>
                      <td className="py-0 pe-md-0">
                        <img src={ product.images?.length > 0 ? product.images[0].src : "https://placehold.co/100"} alt={product.name} width="90" />
                      </td>
                      <td className="ps-lg-0">
                        <p className="m-0" onClick={() => onShowProductModal(product)}> {product.name} <br /> {product.price} €</p>
                      </td>
                      <td className="px-0">
                        <div className="d-flex">
                          <button className="plus-button" onClick={() => handleQuantityChange( product.id, productQuantities[product.id] - 1, subcategory.id )}>
                            -
                          </button>
                          <input type="number" className="quantity-input-box" value={productQuantities[product.id] || 1} onChange={(e) => handleQuantityChange( product.id, parseInt(e.target.value, 10) || 0, subcategory.id )} />
                          <button className="plus-button" onClick={() => handleQuantityChange( product.id, productQuantities[product.id] + 1, subcategory.id )}>
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className="btn-close" onClick={() => handleRemoveProduct(subcategory.id, product.id)}></button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan="2">
                  <h3>SUM: {totalSum.toFixed(2)}€</h3>
                </td>
                <td colSpan="2">
                  <button className="btn btn-sm" onClick={addToCart}>
                    Add to cart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default BoxProductTable;
