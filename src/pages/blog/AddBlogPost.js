import React, { useState, useEffect, useRef } from "react";
import compressImage from "../../utils/compressImage";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddBlogPost = () => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/wp-json/wp/v2/categories?per_page=100`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryOptions(data);
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id);
        }
      })
      .catch(err => console.error("Greška pri dohvaćanju kategorija:", err));
  }, [selectedCategoryId]);

  // Efekt za prikazivanje i skrivanje toast-a
  useEffect(() => {
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setMessage(""), 300); // Čistimo poruku nakon što se toast sakrije
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.7);
      setImage(compressed);
    } catch (error) {
      alert(error.message || "Neuspješna kompresija slike.");
      imageInputRef.current.value = "";
      setImage(null);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    formData.append("title", title);

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    const imageId = await handleImageUpload();

    const postData = {
      title,
      content,
      status: "pending",
      featured_media: imageId,
      categories: [selectedCategoryId],
    };

    const response = await fetch(`${backendUrl}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`Blog post created: ${data.title.rendered}`);
      setTitle("");
      setContent("");
      setImage(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else {
      console.error(data);
      setMessage("Failed to create blog post.");
    }
  };

  return (
    <section id="add-blog" className="container py-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <h1 className="text-center mb-4">Create New Blog Post</h1>
          
          {/* Toast poruka */}
          {showToast && message && (
            <div 
              className={`alert alert-success alert-dismissible fade ${showToast ? 'show' : ''}`} 
              role="alert"
              style={{
                position: "relative",
                marginBottom: "20px",
                transition: "opacity 0.3s ease-in-out"
              }}
            >
              {message}
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} aria-label="Form for submitting a new blog post">
            {/* Category */}
            <div className="mb-3">
              <label htmlFor="categorySelect" className="form-label">Category</label>
              <select
                id="categorySelect"
                className="form-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="mb-3">
              <label htmlFor="titleInput" className="form-label">Title</label>
              <input
                type="text"
                id="titleInput"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="mb-3">
              <label htmlFor="contentTextarea" className="form-label">Content</label>
              <textarea
                id="contentTextarea"
                className="form-control"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">Featured Image</label>
              <input
                type="file"
                id="imageUpload"
                className="form-control"
                onChange={handleImageSelect}
                ref={imageInputRef}
                aria-describedby="imageHelp"
              />
              <div id="imageHelp" className="form-text">Optional – image will be compressed before upload.</div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-prim w-100">
              Submit Blog Post
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddBlogPost;