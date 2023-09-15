import { makeRequest } from "./makeRequest"

export function getPosts() {
  return makeRequest("/posts")
}

export function getPostById(_id) {
  return makeRequest(`/posts/${_id}`)
}

export function getPostPage(page, postsPerPage) {
  return makeRequest(`/posts/?_page=${page}&_limit=${postsPerPage}`)
}

export function createPost( {title, body, image} ) {
  return makeRequest(`/posts`, {
    method: "POST",
    data : {
      title,
      body, 
      image,
    }
  })
}

export function updatePost( {title, body, _id} ) {
  return makeRequest(`/posts/${_id}`, {
    method: "PUT",
    data : {
      title,
      body,
      _id 
    }
  })
}

export function deletePost(_id) {
  return makeRequest(`posts/${_id}}`, {
    method: "DELETE",
  })
}