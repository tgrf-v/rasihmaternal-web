export interface ArticleItem {
  id: string;
  letter: string;
  title: string;
  category: string;
  content?: string;
  summary: string;
  firstAid: string;
}

export interface VideoItem {
  id: string;
  title: string;
  badge: string;
  category: string;
  instructor: string;
  youtubeId: string;
  duration: string;
  description: string;
}
