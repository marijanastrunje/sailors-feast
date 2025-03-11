import React, { useState, useEffect}  from "react";

const Cro = () => {

    const [data, setData] = useState(null);

    useEffect(
        () => {
            fetch('https://restcountries.com/v3.1/alpha/CRO')
            .then(response => response.json())
            .then(data => setData(data))
        }, []

    );

    if (!data) {
        return <p>Loading...</p>; 
    }

    return(
        <div dangerouslySetInnerHTML={{ __html: data.content.rendered }} />
    );
};

export default Cro; 