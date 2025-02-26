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
  author_id: number;
  author_username: string;
  comment_author_picture: string | null;
  created_on: string;
}
