import React, { useState } from 'react'
import IconBtn from './IconBtn'
import { FaEdit, FaHeart, FaReply, FaTrash } from 'react-icons/fa'
import { usePost } from '../contexts/PostContext'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { useAsyncFn } from '../hooks/useAsync'
import { createComment, deleteComment, rateComment, updateComment } from '../services/comments'
import StarRating from './StarRating';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

const Comment = ({ _id, message, userId, createdAt }) => {
    const [rating, setRating] = useState(0); // Initial rating state

    const handleRate = (newRating) => {
        if (!_id || newRating === undefined) {
            console.error('_id and rating are required.');
            return;
          }
      rateComment({ commentId: _id, rating: newRating, userId })
      .then(() => {
        setRating(newRating);
      })
      .catch((error) => {
        console.error('Error rating comment:', error);
      });
      setRating(newRating);

    };
    const { post, getReplies, createLocalComment, updateLocalComment, deleteLocalComment } = usePost();
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    const childComments = getReplies(_id);
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const formattedDate = createdAt;
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    function onCommentReply(message) {
        return createCommentFn.execute({
            postId: post._id,
            message,
            parentId: _id,
            createdAt: Date.now(),
        }).then(comment => {
            setIsReplying(false);
            createLocalComment(comment)
        }
        ).catch((error) => {
            console.error('Error creating comment:', error);
        });
    }
    function onCommentUpdate(message) {
        return updateCommentFn
            .execute({ postId: post._id, message, _id })
            .then(comment => {
                setIsEditing(false)
                updateLocalComment(_id, comment.message)
            })
    }

    function onCommentDelete() {
        return deleteCommentFn
            .execute({ postId: post._id, _id })
            .then(comment => deleteLocalComment(_id))
    }
    return (
        <>
            <div className='comment'>
                <div className='header'>
                    <span className='date'>
                        {formattedDate}
                    </span>
                    <StarRating maxStars={5} initialRating={rating} onRate={handleRate} />
                </div>
                {isEditing ? <CommentForm
                    autoFocus
                    initialValue={message}
                    onSubmit={onCommentUpdate}
                    loading={updateCommentFn.loading}
                    error={updateCommentFn.error}
                /> : <div className='message'>{message}</div>}
                <div className='footer'>
                    <IconBtn Icon={FaHeart} aria-label='Like'>
                        2
                    </IconBtn>
                    <IconBtn
                        onClick={() =>
                            setIsReplying(prev => !prev)
                        }
                        isActive={isReplying}
                        Icon={FaReply}
                        aria-label={isReplying ? 'Cancel' : 'Reply'}
                    />
                    <IconBtn
                        onClick={() =>
                            setIsEditing(prev => !prev)
                        }
                        isActive={isEditing}
                        Icon={FaEdit}
                        aria-label='Edit' />
                    <IconBtn disabled={deleteCommentFn.loading} Icon={FaTrash} onClick={onCommentDelete} aria-label='Delete' color='danger' />
                </div>
                {deleteCommentFn.error && (
                    <div className="error-msg mt-1">{deleteCommentFn.error}</div>
                )}
            </div>
            {isReplying && (
                <div className='mt-1 ml-3'>
                    <CommentForm autoFocus onSubmit={onCommentReply}
                        loading={createCommentFn.loading}
                        error={createCommentFn.error}
                    />
                </div>
            )}
            {childComments?.length > 0 && (
                <>
                    <div
                        className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""
                            }`}
                    >
                        <button
                            className="collapse-line"
                            aria-label="Hide Replies"
                            onClick={() => setAreChildrenHidden(true)}
                        />
                        <div className="nested-comments">
                            <CommentList comments={childComments} />
                        </div>
                    </div>
                    <button
                        className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
                        onClick={() => setAreChildrenHidden(false)}
                    >
                        Show Replies
                    </button>
                </>
            )}
        </>
    )
}

export default Comment
