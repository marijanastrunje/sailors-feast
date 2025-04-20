import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendedBoxes.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RecommendedBoxes = ({ boxIds }) => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boxIds || boxIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchBoxes = async () => {
      try {
        const promises = boxIds.map(id =>
          fetch(`${backendUrl}/wp-json/wp/v2/boxes/${id}?_embed`)
            .then(res => res.json())
        );
        const boxesData = await Promise.all(promises);
        setBoxes(boxesData);
      } catch (error) {
        console.error("Error fetching recommended boxes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, [boxIds]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border spinner-border-sm text-prim" role="status">
          <span className="visually-hidden">Loading boxes...</span>
        </div>
      </div>
    );
  }

  if (boxes.length === 0) return null;

  return (
    <div className="recommended-boxes mt-5 mb-4">
      <div className="header-container text-center mb-4">
        <h2 className="mb-3">Everything you need, in our boxes</h2>
        <p className="fs-5 text-body-secondary px-3">
          These boxes contain all the ingredients needed for this recipe. 
          Click on a box to see what's inside and add it to your cart in just a few seconds.
        </p>
      </div>

      <div className="row">
        {boxes.map((box) => {
          const image = box._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return (
            <div key={box.id} className="box-card col-12 col-md-6 col-xl-3 d-flex justify-content-center">
              <div className="card mb-4 shadow-sm">
                {image ? (
                  <Link to={`/${box.slug}`}>
                    <div className="box-img-top">
                      <img src={image} alt={box.title.rendered} />
                    </div>
                  </Link>
                ) : (
                  <div className="box-img-top placeholder-img">No image</div>
                )}
                <div className="card-body">
                  <Link to={`/${box.slug}`} className="box-title-link">
                    <h5 className="card-title" dangerouslySetInnerHTML={{ __html: box.title.rendered }} />
                  </Link>
                  <div className="card-text-container">
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: box.content.rendered }} />
                  </div>
                  <Link to={`/${box.slug}`}>
                    <button className="btn btn-prim mt-2">View Box</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedBoxes;