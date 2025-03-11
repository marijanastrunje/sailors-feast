import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

const Countries = () => {

    const [countries, setCountries] = useState([]);

    useEffect(
        () => {
            fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => setCountries(data))
        }, []);

    return(
        <>
        <div className="container">
        {countries.map((country) => (
            <p key={country.ccn3}>
            <Link to={"/countries/" + country.ccn3}>{country.name.common}
            </Link>
            </p>
        ))}
        </div>
        </>
    );
};

export default Countries;           