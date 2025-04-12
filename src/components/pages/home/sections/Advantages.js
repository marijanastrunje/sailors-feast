import React, { useEffect, useState } from "react";
import "./Advantages.css";
import AdvantagesSkeleton from "./AdvantagesSkeleton"; // Import the skeleton component

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Advantages = () => {
  const [advantages, setAdvantages] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    fetch(`${backendUrl}/wp-json/wp/v2/pages?slug=advantages&_fields=acf`)
      .then(res => res.json())
      .then(data => {
        const acf = data[0]?.acf;
        if (acf) {
          const items = [1, 2, 3].map(i => {
            const img = acf[`advantage_image_${i}`];
            return {
              title: acf[`advantage_title_${i}`],
              description: acf[`advantage_description_${i}`],
              image: img?.sizes?.medium || img?.url || "",
              alt: img?.alt || `Advantage ${i}`
            };
          });
          setAdvantages(items);
        }
        setLoading(false); // Set loading to false when data is received
      })
      .catch(err => {
        console.error("Error fetching advantages:", err);
        setLoading(false); // Also set loading to false on error
      });
  }, []);

  // If loading, show the skeleton component
  if (loading) return <AdvantagesSkeleton />;
  
  // If no advantages loaded (and not loading), you could return null or some fallback
  if (advantages.length === 0) return null;

  return (
    <div className="container mt-4 mt-sm-5">
      <div className="row">
        {advantages.map((item, index) => {
          let imageCol = "col-xl-6";
          let imageOrder = "order-1 order-md-1";
          let textCol = "col-xl-6";
          let textOrder = "order-2 order-md-2";
          let textAlign = "text-start text-md-center text-xl-start";
          
          if (index === 1) {
            imageCol = "col-xl-5";
            imageOrder = "order-2 order-md-1";
            textOrder = "order-1 order-md-2";
            textAlign = "text-end text-md-center text-xl-start";
          } else if (index === 2) {
            imageCol = "col-xl-5";
            imageOrder = "order-first order-md-first";
            textOrder = "order-2 order-md-2";
            textAlign = "text-start text-md-center text-xl-start";
          }
          
          return (
            <div key={index} className="col-md-4 advantage-item mb-4 mb-md-0">
              <div className="row px-2 align-items-center justify-content-center">
                <div className={`advantage-image col-6 col-md-12 ${imageCol} ${imageOrder} text-center`}>
                  <img
                    src={item.image}
                    width={180}
                    height={130}
                    alt={item.alt}
                    title={item.alt}
                    className="object-fit-cover mb-2"
                  />
                </div>
                <div className={`col-6 col-md-12 ${textCol} ${textOrder} ${textAlign} p-0`}>
                  <h3 className="advantage-label">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Advantages;