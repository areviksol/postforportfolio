import React, { useEffect, useState } from 'react';
import { createPost, deletePost, getPosts, updatePost } from '../services/posts';
import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import ReactPaginate from 'react-paginate';
import './PostList.css'
import Navbar from './Navbar.js';
import AddPostForm from './AddPostForm';
const PostList = () => {  
  const { loading, error, value: posts } = useAsync(getPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [sortOption, setSortOption] = useState('rank');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedBody, setUpdatedBody] = useState('');
  const [editPostId, setEditPostId] = useState(null); 
  useEffect(() => {
    const refreshEventListener = () => {
      console.log('Custom refresh event received.');
      window.location.reload();
    };

    window.addEventListener('custom-refresh-event', refreshEventListener);

    return () => {
      window.removeEventListener('custom-refresh-event', refreshEventListener);
    };
  }, []); 
  const handleSortChange = (event) => {
    console.log('Sorting option changed:', event.target.value);
    setSortOption(event.target.value);
  };
  
  
  const sortPosts = (sortedPosts, sortOption) => {
    if (sortOption === 'rank') {
      return [...sortedPosts].sort((a, b) => b.rank - a.rank); 
    } else if (sortOption === 'date') {
      return [...sortedPosts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
    } else if (sortOption === 'newest') {
      console.log("sortedPosts", sortedPosts);
      console.log([...sortedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
    }
    
    return sortedPosts;
  };
  const handleEditClick = (postId) => {
    setEditPostId(postId);
    
    const postToEdit = sortedPosts.find((post) => post._id === postId);
    
    setUpdatedTitle(postToEdit.title);
    setUpdatedBody(postToEdit.body);
  };
  const handleSaveClick = async (postId) => {
    try {
      const postToEdit = sortedPosts.find((post) => post._id === postId);
      console.log("postToEdit is ", postToEdit);
      const updatedPost = {
        ...postToEdit,
        title: updatedTitle,
        body: updatedBody,
      };
  
      const response = await updatePost(updatedPost);
  
      if (response.ok) {
        setEditPostId(null); 
        setUpdatedTitle('');
        setUpdatedBody('');
      } else {
        console.error('Error updating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };
  

  const handleCancelClick = () => {
    setEditPostId(null);
    setUpdatedTitle('');
    setUpdatedBody('');
  };
  const sortedPosts = Array.isArray(posts) ? sortPosts(posts, sortOption) : [];

  if (loading) {
    return <h1>Loading</h1>;
  }

  if (error) {
    return <h1 className="error-msg">{error}</h1>;
  }



  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredPosts = sortedPosts.filter((post) => {
    if (post && post.title && post.body) {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return false; 
  });
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
  const handleAddPost = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('body', newPost.body);
      formData.append('image', newPost.image);
      await createPost(newPost);

    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  const renderEditForm = (postId) => {
    console.log("is id", postId)
    if (editPostId === postId) {
      return (
        <div className="edit-form">
          <input
            type="text"
            placeholder="New Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <textarea
            placeholder="New Body"
            value={updatedBody}
            onChange={(e) => setUpdatedBody(e.target.value)}
          />
          <button onClick={() => handleSaveClick(postId)}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      );
    }
    return null;
  };

  const handleDeleteClick = (_id) => {
    deletePost(_id) 
      .then((response) => {
        console.log(response.data); 
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };
  return (
    <>
      <Navbar />
      <div className="post-list-container">
        <AddPostForm onAddPost={handleAddPost} />

        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="rank">Sort by Rank</option>
          <option value="date">Sort by Date (Oldest First)</option>
        </select>

        {fetchError ? (
          <div className="error-msg">{fetchError}</div>
        ) : (
          postsToDisplay.map((post) => (
            <div key={post._id} className="post-card">
              <h1 className="post-title">
                <Link to={`/posts/${post._id}`}>{post.title}</Link>
              </h1>
              {renderEditForm(post._id)} 
              {editPostId !== post._id && (
                <button onClick={() => handleEditClick(post._id)}>Edit</button>
              )}
              <p className="post-excerpt">{post.body}</p>
            </div>
          ))
        )}
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
  
};
export default PostList
