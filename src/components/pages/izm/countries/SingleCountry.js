import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import './Croatia.css'

const SingleCountry = () => {

    const {name} = useParams();    
    const [country, setCountry] = useState(null);

    useEffect(
            () => {
                fetch('https://restcountries.com/v3.1/name/croatia')
                .then(response => response.json())
                .then(data => setCountry(data[0]))
            }, [name]
        );
    
        if (!country) {
            return <p>Loading...</p>; 
        } 

    return(
        <div className="col-md-2 card p-3">
            <h4><img src={country.flags.png} alt="Country flag" className="flag ms-1" /> <span dangerouslySetInnerHTML={{ __html:country.name.common}} /></h4>
            <ul className="country ms-2">
                <li>🌍 <span dangerouslySetInnerHTML={{ __html:country.region}} /></li>
                <li>🏙️ <span dangerouslySetInnerHTML={{ __html:country.capital}} /></li>
                <li>🗣️ <span dangerouslySetInnerHTML={{ __html:country.languages.hrv}} /></li>
                <li>💰 <span dangerouslySetInnerHTML={{ __html:country.currencies.EUR.name}}/><span dangerouslySetInnerHTML={{ __html:country.currencies.EUR.symbol}} /></li>
                <li>👥 <span dangerouslySetInnerHTML={{ __html:country.population}} /></li>
            </ul>
        </div>
    );
};

export default SingleCountry;  