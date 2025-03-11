import React, { useState, useEffect } from 'react';


const Exchange = () => {

    const [currencyRates, setCurrencyRates] = useState({});
    const [amount, setAmount] = useState(1);
    const [currency, setCurrency] = useState ("EUR");

    useEffect(() => {
        fetch('https://api.frankfurter.dev/v1/latest?base=' + currency)
            .then(response => response.json())
            .then(data => setCurrencyRates(data));
    }, [currency]);

    if (!currencyRates.rates) return <p>Učitavanje...</p>;

    return (

        <div className="container blog">
            <h4>Exchange Rates</h4>
            <div>
                <select name='currency' id='currency' value={currency} onChange={(e) => 
                    setCurrency(e.target.value)}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                </select>
                <input type='number' value={amount} onChange={(e) => 
                    setAmount(e.target.value)} />
            <div>       
                <select name='currency' id='currency' value={currency} onChange={(e) => 
                    setAmount(e.target.value)}>   
                {Object.keys(currencyRates.rates).map(currency => (
                    <option key={currency}>
                        <strong>{currency}:</strong> 
                        {currencyRates.rates[currency] * amount}
                    </option>     
                ))}
                </select>  
                <input
                    type="number"
                    value={0.00}
                    disabled />    
            </div> 
            </div>
        </div>
    );
};
export default Exchange;
