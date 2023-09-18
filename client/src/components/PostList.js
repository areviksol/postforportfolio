import React, { useEffect, useState } from 'react';
import { createPost, deletePost, getPosts, updatePost } from '../services/posts';
import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import ReactPaginate from 'react-paginate';
import Navbar from './Navbar.js';
import AddPostForm from './AddPostForm';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
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
      console.log('New Post Data:', newPost);
      console.log('form data post Data:', newPost);

      const response = await createPost(formData);

      if (response.ok) {
        // Post created successfully, you can handle the response here
        console.log('Post created successfully:', response.data);
      } else {
        console.error('Error creating post:', response.statusText);
      }
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
                      <Card.Img
                        style={{ width: '500px', height: '500px' }} 
                        variant="top"
                        src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, post.image.data))}`}
                        onError={(e) => {
                          e.target.src = 'placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />                      <Card.Body>
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
