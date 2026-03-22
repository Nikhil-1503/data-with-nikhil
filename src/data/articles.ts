export interface Article {
  id: string;
  title: string;
  description: string;
  tags: string[];
  readingTime: number;
  date: string;
  author: string;
  featured: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  content: ArticleSection[];
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'callout' | 'image';
  level?: number;
  text?: string;
  language?: string;
  items?: string[];
  calloutType?: 'takeaway' | 'usecase' | 'interview';
  src?: string;
  caption?: string;
}

import {
  sparkShuffleOptimization,
  medallionArchitectureGuide,
  sqlWindowFunctionsMastery,
  airflowBestPractices,
  snowflakeCostOptimization,
  pysparkTestingStrategies,
} from "./content/index";

export const articles: Article[] = [
  sparkShuffleOptimization,
  medallionArchitectureGuide,
  sqlWindowFunctionsMastery,
  airflowBestPractices,
  snowflakeCostOptimization,
  pysparkTestingStrategies,
];

export const allTags = [...new Set(articles.flatMap(a => a.tags))].sort();