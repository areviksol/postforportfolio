import React, { useState } from 'react';
import './AddPostForm.css';

const AddPostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleDeleteImage = () => {
    // Clear the selected image and image preview
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new post object with title, body, and image
    const newPost = {
      title,
      body,
      image,
    };

    // Call the onAddPost function from the parent component
    onAddPost(newPost);

    // Reset form fields
    setTitle('');
    setBody('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={handleBodyChange}
      />
      {!image && (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <p>Choose an image</p>
        </div>
      )}
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Image Preview"
            className="image-preview"
          />
          <button type="button" onClick={handleDeleteImage}>
            Delete Image
          </button>
        </div>
      )}
      <button type="submit">Add Post</button>
    </form>
  );
};

export default AddPostForm;
