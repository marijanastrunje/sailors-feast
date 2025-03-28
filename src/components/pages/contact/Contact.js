import React, { useState } from "react";
import Faq from "../all-pages/Faq";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://backend.sailorsfeast.com/wp-json/custom/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        alert(data.message);
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        alert(data.message || "Došlo je do greške.");
      }
    } catch (err) {
      setStatus("error");
      alert("Greška pri slanju.");
    }
  };

  return (
    <>
        <div class="my-5">
            <div class="p-2 text-center bg-body-tertiary">
                <div class="container py-3">
                <h1 class="text-body-emphasis">Full-width jumbotron</h1>
                <p class="col-lg-8 mx-auto lead">
                    This takes the basic jumbotron above and makes its background edge-to-edge with a <code>.container</code> inside to align content. Similar to above, it's been recreated with built-in grid and utility classes.
                </p>
                </div>
            </div>
        </div>
        <div className="container mb-5">
            <div className="row">
                <div className="col-md-6">
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h2 className="mb-3">Kontaktirajte nas</h2>
                    <p>
                        Imate pitanje, prijedlog ili trebate pomoć pri narudžbi?<br />
                        Slobodno nam pišite – rado ćemo vam odgovoriti!<br />
                    </p>
                    <p>Sailors Feast<br />
                        0955399166<br />
                        Ulica i broj <br />
                        Grad</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                        <label className="form-label">Vaše ime</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Vaše ime"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="mb-3">
                        <label className="form-label">Email adresa</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email adresa"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="mb-3">
                        <label className="form-label">Poruka</label>
                        <textarea
                            name="message"
                            placeholder="Vaša poruka"
                            className="form-control"
                            value={form.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        </div>

                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="privacyConsent"
                            required
                          />
                          <label className="form-check-label" htmlFor="privacyConsent">
                            Slažem se s <a href="/privacy-policy" target="_blank">pravilima privatnosti</a>.
                          </label>
                        </div>

                        <button className="btn btn-secondary" type="submit">
                        Pošalji
                        </button>
                    </form>
                    </div>

            </div>
        </div>
        <div id="Faq">
            <Faq topicId={197} topic="Contact" />
        </div>
    </>
  );
};

export default ContactForm;

