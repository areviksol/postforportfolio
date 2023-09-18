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
      // Resize the selected image before uploading
      // const resizedImage = await resizeImage(selectedImage);

      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set the canvas dimensions to resize the image
          const maxWidth = 800; // Set your desired maximum width
          const maxHeight = 800; // Set your desired maximum height

          let newWidth = img.width;
          let newHeight = img.height;

          if (img.width > maxWidth) {
            newWidth = maxWidth;
            newHeight = (img.height * maxWidth) / img.width;
          }

          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = (img.width * maxHeight) / img.height;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert the canvas to a blob
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          }, file.type);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
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
      )}      {imagePreview && (
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
