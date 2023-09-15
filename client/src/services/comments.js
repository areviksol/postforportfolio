import { makeRequest } from "./makeRequest"

export function createComment({ postId, message, parentId }) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  })
}

export function updateComment({ postId, message, _id }) {
  return makeRequest(`posts/${postId}/comments/${_id}`, {
    method: "PUT",
    data: { message },
  })
}

export function deleteComment({ postId, _id }) {
  return makeRequest(`posts/${postId}/comments/${_id}`, {
    method: "DELETE",
  })
}

export function toggleCommentLike({ _id, postId }) {
  return makeRequest(`/posts/${postId}/comments/${_id}/toggleLike`, {
    method: "POST",
  })
}

export function rateComment({ commentId, rating, userId }) {
  return makeRequest(`/posts/rate-comment`, {
    method: "POST",
    data : {
      commentId,
      rating, 
      userId,
    }
  })
}