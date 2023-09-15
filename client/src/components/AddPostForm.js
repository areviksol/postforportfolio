// AddPostForm.js
import React, { useState } from 'react';
import "./AddPostForm.css"
const AddPostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
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
      <button type="submit">Add Post</button>
    </form>
  );
};

export default AddPostForm;
