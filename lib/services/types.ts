// ─── Shared result type ───────────────────────────────────────────────────────

export type ServiceResult<T> =
  | ({ error: null } & T)
  | { error: string };

export type VoidResult = { error: null } | { error: string };

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "archived" | "wip";

export type LiveDataItem = { label: string; value: string };

export type ProjectLinks = {
  deployed?: string;
  github?: string;
  [key: string]: string | undefined;
};

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
  cover_image: string | null;
  links: ProjectLinks;
  live_data: LiveDataItem[] | null;
  featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export type CreateProjectInput = {
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  stack?: string[];
  cover_image?: string | null;
  links?: ProjectLinks;
  live_data?: LiveDataItem[] | null;
  featured?: boolean;
  position?: number;
};

export type UpdateProjectInput = Partial<{
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
  cover_image: string | null;
  links: ProjectLinks;
  live_data: LiveDataItem[] | null;
  featured: boolean;
  position: number;
}>;

// ─── Experience ───────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  achievements: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  company_url: string | null;
  logo_url: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export type CreateExperienceInput = {
  company: string;
  role: string;
  description: string;
  achievements: string;
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  company_url?: string | null;
  logo_url?: string | null;
  position?: number;
};

export type UpdateExperienceInput = Partial<{
  company: string;
  role: string;
  description: string;
  achievements: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  company_url: string | null;
  logo_url: string | null;
  position: number;
}>;

// ─── Experiments ──────────────────────────────────────────────────────────────

export type ExperimentStatus = "live" | "wip" | "archived" | "idea";

export type ExperimentLinks = {
  deployed?: string;
  github?: string;
  [key: string]: string | undefined;
};

export interface Experiment {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus;
  stack: string[];
  links: ExperimentLinks;
  cover_image: string | null;
  featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export type CreateExperimentInput = {
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus;
  stack?: string[];
  links?: ExperimentLinks;
  cover_image?: string | null;
  featured?: boolean;
  position?: number;
};

export type UpdateExperimentInput = Partial<{
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus;
  stack: string[];
  links: ExperimentLinks;
  cover_image: string | null;
  featured: boolean;
  position: number;
}>;

// ─── Awards ───────────────────────────────────────────────────────────────────

export interface Award {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  date: string;
  url: string | null;
  image_url: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export type CreateAwardInput = {
  title: string;
  issuer: string;
  description?: string | null;
  date: string;
  url?: string | null;
  image_url?: string | null;
  position?: number;
};

export type UpdateAwardInput = Partial<{
  title: string;
  issuer: string;
  description: string | null;
  date: string;
  url: string | null;
  image_url: string | null;
  position: number;
}>;

// ─── Board ────────────────────────────────────────────────────────────────────

export type BoardStatus = "backlog" | "in_progress" | "done" | "on_hold";
export type BoardCategory = "goal" | "project" | "learning" | "idea" | "other";
export type BoardPriority = "low" | "medium" | "high";

export interface SubItem {
  id: string;
  parent_id: string;
  title: string;
  description: string | null;
  status: BoardStatus;
  is_private: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface BoardItem {
  id: string;
  title: string;
  description: string | null;
  status: BoardStatus;
  category: BoardCategory;
  priority: BoardPriority | null;
  due_date: string | null;
  is_private: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  sub_items: SubItem[];
}

export type BoardGrouped = {
  backlog: BoardItem[];
  in_progress: BoardItem[];
  done: BoardItem[];
  on_hold: BoardItem[];
};

export type CreateBoardItemInput = {
  title: string;
  description?: string | null;
  status: BoardStatus;
  category: BoardCategory;
  priority?: BoardPriority | null;
  due_date?: string | null;
  is_private?: boolean;
  position?: number;
};

export type UpdateBoardItemInput = Partial<{
  title: string;
  description: string | null;
  status: BoardStatus;
  category: BoardCategory;
  priority: BoardPriority | null;
  due_date: string | null;
  is_private: boolean;
  position: number;
}>;

export type CreateSubItemInput = {
  title: string;
  description?: string | null;
  status: BoardStatus;
  is_private?: boolean;
  position?: number;
};

export type UpdateSubItemInput = Partial<{
  title: string;
  description: string | null;
  status: BoardStatus;
  is_private: boolean;
  position: number;
}>;

// ─── Activity ─────────────────────────────────────────────────────────────────

export type ActivityType =
  | "commit"
  | "blog_post"
  | "project_update"
  | "experiment"
  | "note";

export type ActivityMetadata =
  | { repo: string; branch: string; sha: string; message: string }
  | { slug: string; hashnode_id: string }
  | { project_slug: string }
  | { experiment_slug: string }
  | Record<string, never>;

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  url: string | null;
  metadata: ActivityMetadata | null;
  created_at: string;
}

export type CreateActivityInput = {
  type: ActivityType;
  title: string;
  description?: string | null;
  url?: string | null;
  metadata?: Record<string, unknown> | null;
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export type AnalyticsRange = "7d" | "30d" | "90d";

export interface PageView {
  id: string;
  page: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  visited_at: string;
}

export interface DashboardStats {
  total_visits: number;
  total_blog_reads: number;
  total_project_interactions: number;
  total_conversations: number;
  project_count: number;
  experience_count: number;
  experiment_count: number;
  award_count: number;
  board_item_count: number;
  context_entry_count: number;
  activity_count: number;
}

// ─── Chats / LLM ──────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  session_id: string;
  ip_hash: string | null;
  started_at: string;
  last_message_at: string;
  message_count: number;
}

export interface LlmMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export type OpenAIMessage = {
  role: "user" | "assistant";
  content: string;
};

// ─── System Context ───────────────────────────────────────────────────────────

export type ContextCategory =
  | "professional"
  | "personal"
  | "opinions"
  | "instructions";

export interface SystemContextEntry {
  id: string;
  label: string;
  content: string;
  category: ContextCategory | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateContextEntryInput = {
  label: string;
  content: string;
  category?: ContextCategory | null;
  position?: number;
  is_active?: boolean;
};

export type UpdateContextEntryInput = Partial<{
  label: string;
  content: string;
  category: ContextCategory | null;
  position: number;
  is_active: boolean;
}>;

// ─── Hashnode ─────────────────────────────────────────────────────────────────

export interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  cover_image_url: string | null;
  published_at: string;
  read_time_minutes: number;
  tags: Array<{ name: string; slug: string }>;
}

export interface HashnodePostDetail extends HashnodePost {
  content_html: string;
}

export interface HashnodePageInfo {
  has_next_page: boolean;
  end_cursor: string | null;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export type StorageBucket =
  | "project-covers"
  | "experiment-covers"
  | "company-logos"
  | "award-images";

// ─── Reorder ─────────────────────────────────────────────────────────────────

export type ReorderItem = { id: string; position: number };
