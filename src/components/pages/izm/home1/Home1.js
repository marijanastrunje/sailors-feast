import React, { useState, useEffect}  from "react";
import './Home1.css';

const Home1 = () => {

    const [data, setData] = useState(null);

    useEffect(
        () => {
            fetch('https://backend.sailorsfeast.com/wp-json/wp/v2/pages/170')
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

export default Home1; 