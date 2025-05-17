import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Faq from "../../components/common/Faq";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
import SEO from "../../components/common/SEO";
import "./AllBoxes.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AllBoxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [acfFields, setAcfFields] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/boxes?per_page=10&_embed`)
      .then((res) => res.json())
      .then((data) => {
        setBoxes(data);
        if (data.length > 0) setSelectedBoxId(data[0].id);

        const allKeys = new Set();
        data.forEach((box) => {
          const acf = box.acf || {};
          Object.entries(acf).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => allKeys.add(item));
            } else if (value === true || value === 1) {
              allKeys.add(key);
            }
          });
        });
        setAcfFields(Array.from(allKeys).sort());
      })
      .catch((err) => console.error("Error fetching boxes:", err));
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
    <SEO
      title="All boxes"
      description="Check out our fun and tasty Sailor's Feast food boxes! Get snacks, drinks, and more delivered right to your boat in Croatia."
      keywords={['food boxes', 'boat snacks', 'sailing Croatia', 'yacht food', 'Sailor\'s Feast']}
      path="/all-boxes"
    />

    <div className="container pb-3">
      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1>Pricing</h1>
        <p className="fs-5 text-body-secondary">
          Quickly build an effective pricing table for your potential customers with this Bootstrap example. It’s built with default Bootstrap components and utilities with little customization.
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
                  <div className="card-img-top placeholder-img">No image</div>
                )}
                <div className="card-body">
                  <Link to={`/${box.slug}`}>
                    <h5 className="card-title" dangerouslySetInnerHTML={{ __html: box.title.rendered }} />
                  </Link>
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: box.content.rendered }} />
                  <Link to={`/${box.slug}`}>
                    <button className="btn btn-prim mt-2">View Box</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="display-6 text-center mb-md-5 pt-md-5 d-none">Compare</h2>

      <div className="table-responsive d-none">
        <table className="table text-center">
          <thead>
            <tr>
            <th className="responsive-th"></th>
              {isMobile ? (
                <th style={{ width: "50%" }}>
                  <select
                    className="form-select"
                    value={selectedBoxId || boxes[0]?.id}
                    onChange={(e) => setSelectedBoxId(Number(e.target.value))}
                  >
                    {boxes.map((box) => (
                      <option key={box.id} value={box.id}>
                        {box.title.rendered}
                      </option>
                    ))}
                  </select>
                </th>
              ) : (
                boxes.map((box) => (
                  <th key={box.id} style={{ width: `${70 / boxes.length}%` }}>
                    {box.title.rendered}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {acfFields.map((field) => (
              <tr key={field}>
                <th scope="row" className="text-start">{field}</th>
                {isMobile ? (
                  <td>
                    {boxes.find((box) => box.id === selectedBoxId)?.acf?.compare_boxes?.includes(field) ? "✔️" : "—"}
                  </td>
                ) : (
                  boxes.map((box) => (
                    <td key={box.id + field}>
                      {box.acf?.compare_boxes?.includes(field) ? "✔️" : "—"}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="Faq">
        <Faq topicId={196} topic="Food Boxes" />
      </div>
      <ScrollToTopButton />
    </div>
    </>
  );
};

export default AllBoxes;
