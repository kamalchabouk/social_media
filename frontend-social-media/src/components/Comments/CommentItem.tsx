import { deleteComment, fetchComments } from "../../api/post-api";

interface CommentItemProps {
    postId: number;
    comment: {
        id: number;
        comment: string;
        author_username: string;
        created_on: string;
    };
    onCommentDeleted: (comments: any) => void;
}

const CommentItem = ({ postId, comment, onCommentDeleted }: CommentItemProps) => {
    const handleDelete = async () => {
        try {
            await deleteComment(postId, comment.id);
            const updatedComments = await fetchComments(postId);
            onCommentDeleted(updatedComments);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    return (
        <div className="comment-item">
            <p><strong>{comment.author_username}</strong>: {comment.comment}</p>
            <p className="text-gray-500 text-sm">{new Date(comment.created_on).toLocaleString()}</p>
            <button onClick={handleDelete} className="text-red-500">Delete</button>
        </div>
    );
};

export default CommentItem;
