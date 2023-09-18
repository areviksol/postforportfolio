// AddPostForm.js
import React, { useState } from 'react';
import "./AddPostForm.css"
const AddPostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreviewData = e.target.result;
        setImage(e.target.result);
        setImagePreview(imagePreviewData); // This sets the base64-encoded image in your component state
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  // const handleImageChange = (e) => {
  //   const selectedImage = e.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const base64Image = event.target.result;

  //     // Set the base64-encoded image data to the 'image' state
  //     setImage(base64Image);
  //   };

  //   reader.readAsDataURL(selectedImage);  
  // };

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
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Image Preview"
          className="image-preview"
        />
      )}
      <button type="submit">Add Post</button>
    </form>
  );
};

export default AddPostForm;
