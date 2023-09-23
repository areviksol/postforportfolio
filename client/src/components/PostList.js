import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, deletePost, getPosts, updatePost } from '../services/posts';
import { Link } from 'react-router-dom';
import { useAsync, useAsyncFn } from '../hooks/useAsync';
import ReactPaginate from 'react-paginate';
import Navbar from './Navbar.js';
import AddPostForm from './AddPostForm';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import {
  fetchPostsSuccess,
  createPostSuccess,
  updatePostSuccess,
} from './actions';

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [sortOption, setSortOption] = useState('rank');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedBody, setUpdatedBody] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts);
  const { loading, error, value: postsData, execute: fetchPosts } = useAsyncFn(
    getPosts
  );
 useEffect(() => {
    fetchPosts(currentPage, sortOption);
  }, [currentPage, sortOption, dispatch]);
  useEffect(() => {
    if (postsData) {
      dispatch(fetchPostsSuccess(postsData));
    }
  }, [postsData]);
  const handleSortChange = (event) => {
    console.log('Sorting option changed:', event.target.value);
    setSortOption(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
      dispatch(updatePostSuccess(updatedPost));
      setEditPostId(null);
      if (response) {
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
      console.log('New Post Data:', newPost);
      console.log('form data post Data:', newPost);
      const response = await createPost(formData);
      dispatch(createPostSuccess(newPost));
    }
    catch (error) {
      console.error('Error adding post:', error.message);
    }
  };
  const renderEditForm = (postId) => {
    console.log("is id", postId)
    if (editPostId === postId) {
      return (
        <div>
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

  const handleDeleteClick = async (_id) => {
    try {
      await deletePost(_id);
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const getPostImageSrc = (imageData) => {
    if (imageData && imageData.data) {
      const uint8Array = new Uint8Array(imageData.data);
      const blob = new Blob([uint8Array]);
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } else {
      return 'placeholder.jpg';
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <Card className="p-4 mb-4 bg-dark">
              <AddPostForm onAddPost={handleAddPost} />
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="custom-input form-control bg-dark text-white"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  as="select"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="custom-input form-control bg-dark text-white"
                >
                  <option value="rank">Sort by Rank</option>
                  <option value="date">Sort by Date (Oldest First)</option>
                </Form.Control>
              </Form.Group>
              {fetchError ? (
                <div className="error-msg">{fetchError}</div>
              ) : (
                <div>
                  {postsToDisplay.map((post) => (
                    <Card key={post._id} className="mb-3">
                      {post._id}
                      {post.image && post.image.data ? ( // Check if image data is available
                        <Card.Img
                          style={{ width: 'auto', height: 'auto' }}
                          variant="top"
                          src={getPostImageSrc(post.image)}
                          onError={(e) => {
                            e.target.src = 'placeholder.jpg'; // Provide the path to your placeholder image
                            e.target.onerror = null;
                          }}
                        />
                      ) : null}
                      <Card.Body>
                        <h5>
                          <Link to={`/posts/${post._id}`}>{post.title}</Link>
                        </h5>
                        {renderEditForm(post._id)}
                        {editPostId !== post._id && (
                          <div className="btn-group">
                            <Button
                              variant="primary"
                              onClick={() => handleEditClick(post._id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteClick(post._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                        <p>{post.body}</p>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </Col>
        </Row>
      </Container>
    </>
  );

};
export default PostList 