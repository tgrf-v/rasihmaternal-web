export interface AdminArticle {
  id: number;
  type: string;
  letter: string;
  title: string;
  category: string;
  content?: string;
  summary: string;
  first_aid: string;
  is_published: boolean;
  created_at: string;
}

export interface AdminVideo {
  id: number;
  type: string;
  title: string;
  category: string;
  video_badge: string;
  instructor: string;
  youtube_id: string;
  duration: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

export interface StatsData {
  total_articles: number;
  total_videos: number;
  total_categories: number;
}

export interface ArticleFormData {
  type: "article";
  title: string;
  category: string;
  letter: string;
  content: string;
  summary?: string;
  first_aid?: string;
  is_published: boolean;
}

export interface VideoFormData {
  type: "video";
  title: string;
  category: string;
  video_badge: string;
  instructor: string;
  youtube_id: string;
  duration: string;
  description: string;
  is_published: boolean;
}
