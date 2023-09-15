import React from 'react'
import Comment from './Comment'

const CommentList = ({comments}) => {
  const sortedComments = comments.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    sortedComments.map(comment => (
        <div key={comment._id} className='comment-stack'>
            <Comment {...comment}/>
        </div>
    ))
  )
}

export default CommentList
