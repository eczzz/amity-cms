export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_description: string;
  meta_keywords: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  uploaded_by: string;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

// Content Models Types
export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'rich_text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'media'
  | 'reference';

export interface FieldDefinition {
  id: string;
  name: string;
  api_identifier: string;
  field_type: FieldType;
  required: boolean;
  help_text?: string;
  validation?: {
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    pattern?: string;
  };
  default_value?: any;
  reference_to?: string;
  options?: {
    placeholder?: string;
    rows?: number;
  };
}

export interface ContentModel {
  id: string;
  name: string;
  api_identifier: string;
  description: string;
  icon: string;
  fields: FieldDefinition[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ContentEntry {
  id: string;
  content_model_id: string;
  title: string;
  fields: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
