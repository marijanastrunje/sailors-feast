import React, { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Advantages = () => {
  const [advantages, setAdvantages] = useState([]);

  useEffect(() => {
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
      })
      .catch(err => console.error("Error fetching advantages:", err));
  }, []);

  return (
    <section id="advantages">
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
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
