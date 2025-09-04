export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    role: 'patient' | 'doctor';
    genotype?: string;
  };
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
}

export interface PostLike {
  postId: string;
  userId: string;
  liked: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    fullName: string;
    role: 'patient' | 'doctor';
    genotype?: string;
  };
}
