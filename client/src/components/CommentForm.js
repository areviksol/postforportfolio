import React, { useState } from 'react'

const CommentForm = ({
  initialValue = '',
  loading,
  onSubmit,
  error,
  autoFocus = false
}) => {
  const [message, setMessage] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(message).then(() => setMessage(message))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='comment-form-row'>
        <textarea
          autoFocus = {autoFocus}
          value={message}
          className='message-input'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='btn' type='submit' disabled={loading}>
          {loading ? 'Loading' : 'Post'}
        </button>
      </div>
      <div className='error-msg'>{error}</div>
    </form>
  )
}

export default CommentForm
