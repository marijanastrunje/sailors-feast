import React, { useState, useEffect } from "react";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [parent, setParent] = useState(null); 

    useEffect(() => {
        fetch("https://sailorsfeast.com/wp-json/wc/v3/products/categories?parent=0&per_page=30", {
            headers: {
                "Authorization": "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949")
            }
        })
        .then(response => response.json())
        .then(data => setCategories(data.sort((a, b) => a.menu_order - b.menu_order)))
    }, []);

    const fetchSubcategories = (parentId) => {
        console.time("fetchSubcategories");

        if (parent === parentId) {
            setParent(null); // Ako kliknemo opet na istu kategoriju, zatvori je
            setSubcategories([]); // Očisti podkategorije
            return;
        }

        fetch(`https://sailorsfeast.com/wp-json/wc/v3/products/categories?parent=${parentId}`, {
            headers: {
                "Authorization": "Basic " + btoa("ck_971b783339775575928ecdba150f83870eb118b1:cs_eaa4759ea0dd6465903fea8879f9f711fe496949")
            }
        })
        .then(response => response.json())
        .then(data => {
            console.timeEnd("fetchSubcategories");
            setSubcategories(data);
            setParent(parentId);
        })
    };


    if (!categories) {
        return <p>Loading...</p>; 
    } 

    return (
        <div>
            <ul>
                {categories.map(parentCategory => (             
                    <li key={parentCategory.id}>
                        <img src={parentCategory.image ? parentCategory.image.src : "https://placehold.co/100x100"} width={56} height={66} />
                        <h3 onClick={() => fetchSubcategories(parentCategory.id)}>
                            {parentCategory.name} ({parentCategory.count})
                        </h3>
                        {parent === parentCategory.id && subcategories.length > 0 && (
                            <ul className="d-flex">
                                {subcategories.map(subcategory => (
                                    <li key={subcategory.id} className="me-2">{subcategory.name}({subcategory.count})</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
