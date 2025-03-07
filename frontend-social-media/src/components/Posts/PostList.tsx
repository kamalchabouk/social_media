export interface Image {
  id: number;
  image: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  body: string;
  shared_body: string | null;
  created_on: string;
  shared_on: string;
  author_username: string;
  author_id: number;
  author_picture: string | null;
  visibility: "public" | "followers";
  shared_user_username: string | null;
  images: Image[];
  video: string | null;
  likes_count: number;
  dislikes_count: number;
  tags: Tag[];
  comments: Comment[];
}
export interface Comment {
  id: number;
  comment: string;
  created_on: string; // The timestamp of when the comment was created
  author_id: number; // The ID of the author
  author_username: string; // The username of the author
  comment_author_picture: string | null; // URL of the author's profile picture
  likes_count: number; // Number of likes on the comment
  dislikes_count: number; // Number of dislikes on the comment
  post: number; // The post ID to which the comment belongs
  parent: number | null; // The ID of the parent comment if it is a reply, otherwise null
  replies: Comment[]; // The list of replies to this comment (if any)
  tags: string[]; // Any tags associated with the comment
}