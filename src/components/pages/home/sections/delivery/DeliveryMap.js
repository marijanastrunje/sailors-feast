import React, { useEffect, useRef, useState } from "react";
import DeliveryMapSkeleton from "./DeliveryMapSkeleton"; // Import the skeleton component

const DeliveryMap = () => {
  const iframeRef = useRef(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container my-5" ref={iframeRef}>
      <div className="row justify-content-center">
        <h2 className="text-center mb-4">Marina Delivery Points</h2>
        <div className="col-md-10">
          {loadMap ? (
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1u5Hx3EedR34xYeOG-zZPcCueSxX0I5o&ehbc=2E312F&noprof=1"
              width="100%"
              height="400"
              title="Sailor's Feast - Marina Delivery Points Map"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <DeliveryMapSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;