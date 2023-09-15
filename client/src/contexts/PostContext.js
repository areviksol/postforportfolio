import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useAsync } from '../hooks/useAsync';
import { getPostById } from '../services/posts';
import { useParams } from 'react-router-dom';

const Context = React.createContext();

export function usePost() {
    return useContext(Context)
}

const PostProvider = ({ children }) => {
    const { _id } = useParams()
    const { loading, error, value: post } = useAsync(() => getPostById(_id), [_id])
    const [comments, setComments] = useState([])
    const commentsByParentId = useMemo(() => {
        if (comments == null) {
            return [];
        }
        const group = {};
        comments.forEach(comment => {
            group[comment.parentId] ||= [];
            group[comment.parentId].push(comment)
        });
        return group;
    }, [comments]);
    function getReplies(parentId) {
        return commentsByParentId[parentId]
    }

    useEffect(() => {
        if (post?.comments == null) {
            return;
        }
        setComments(post.comments)
    }, [post?.comments])

    function createLocalComment(comment) {
        setComments(prevComments => {
            return [comment, ...prevComments]
        })
    }

    function updateLocalComment(_id, message) {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment._id === _id) {
                    return { ...comment, message }
                } else {
                    return comment
                }
            })
        })
    }
    function deleteLocalComment(_id) {
        setComments(prevComments => (
           prevComments.filter(comment => comment._id !== _id)
        ))
      }
    return (
        <Context.Provider value={{
            post: { _id, ...post },
            getReplies,
            rootComments: commentsByParentId[null],
            createLocalComment,
            updateLocalComment,
            deleteLocalComment
        }}>
            {loading ? (
                <h1>Loading</h1>
            ) : error ? (
                <h1 className="error-msg">{error}</h1>
            ) : (
                <>
                    {children}
                </>
            )}
        </Context.Provider>
    )
}

export default PostProvider
