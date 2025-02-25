import { useState } from "react";
import { createComment,fetchComments } from "../../api/post-api";

interface CommentFormProps {
    postId: number;
    onCommentAdded: (comments: any) => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
    const [comment, setComment] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await createComment(postId, { comment });
            setComment(""); // Reset input field
            const updatedComments = await fetchComments(postId);
            onCommentAdded(updatedComments);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
            <button type="submit">Comment</button>
        </form>
    );
};

export default CommentForm;
