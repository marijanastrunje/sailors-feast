import React, { useState, useEffect, useRef } from "react";

const AddBlogPost = () => {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/categories?per_page=100")
      .then((res) => res.json())
      .then((data) => {
        setCategoryOptions(data);
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id);
        }
      });
  }, [selectedCategoryId]);

  const handleImageUpload = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    formData.append("title", title);

    const response = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/media", {
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
      alert("User not authenticated");
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

    const response = await fetch("https://backend.sailorsfeast.com/wp-json/wp/v2/posts", {
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
          <form onSubmit={handleSubmit}>
            {/* Category */}
            <div className="mb-3">
              <label>Category</label>
              <select
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
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="mb-3">
              <label>Content</label>
              <textarea
                className="form-control"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label>Featured Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageInputRef}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100">
              Submit Blog Post
            </button>

            {/* Message */}
            {message && <p className="mt-3">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddBlogPost;
