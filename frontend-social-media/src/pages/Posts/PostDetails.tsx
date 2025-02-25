import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../../api/post-api";
import "../../styles/Posts/PostDetails.css"

interface Post {
    id: number;
    body: string;
    author_username: string;
    created_on: string;
    comments: Comment[];
}

interface Comment {
    id: number;
    comment: string;
    author_username: string;
    created_on: string;
}

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPostDetails = async () => {
            try {
                const postData = await fetchPostById(Number(postId));
                setPost(postData);
            } catch (err: any) {
                setError(err.message);
            }
        };
        loadPostDetails();
    }, [postId]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail-container">
    <div className="post-header">
        <img
            className="post-author-avatar"
            src={`https://via.placeholder.com/40`} // Replace with actual author profile image
            alt={post.author_username}
        />
        <div>
            <p className="post-author">{post.author_username}</p>
            <p className="post-date">{new Date(post.created_on).toLocaleString()}</p>
        </div>
    </div>
    <p className="post-body">{post.body}</p>
    <hr />
    
    <h3>Comments</h3>
    {post.comments.length === 0 ? (
        <p>No comments yet.</p>
    ) : (
        post.comments.map(comment => (
            <div key={comment.id} className="comment">
                <div className="comment-header">
                    <img
                        className="comment-author-avatar"
                        src={`https://via.placeholder.com/30`} // Replace with actual comment author profile image
                        alt={comment.author_username}
                    />
                    <p className="comment-author">
                        <strong>{comment.author_username}</strong>
                    </p>
                    <p className="comment-date">
                        {new Date(comment.created_on).toLocaleString()}
                    </p>
                </div>
                <p className="comment-body">{comment.comment}</p>
            </div>
        ))
    )}
</div>
    );
};

export default PostDetail;
