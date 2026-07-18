// ==================== Auth Types ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ==================== Core Types ====================
export interface Role {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  phoneNumber: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId: number;
  isActive?: boolean;
  profile: UserProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  leaderId: number;
  name: string;
  description: string | null;
  status: 'PLANNING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  startDate: string | null;
  endDate: string | null;
  leader?: { id: number; name: string; email: string };
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks: number; members: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: number;
  projectId?: number;
  userId: number;
  name?: string;
  email?: string;
  role?: string;
  profile?: UserProfile;
  user?: { id: number; name: string; email: string; profile?: UserProfile };
  joinedAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  assigneeId: number | null;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  dueDate: string | null;
  project?: { id: number; name: string; leaderId?: number };
  assignee?: { id: number; name: string; email: string; profile?: UserProfile } | null;
  comments?: Comment[];
  attachments?: Attachment[];
  _count?: { comments: number; attachments: number };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  user?: { id: number; name: string; email?: string; profile?: UserProfile };
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  taskId: number;
  uploadedBy: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploader?: { id: number; name: string };
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  projectId: number | null;
  action: string;
  description: string | null;
  user?: { id: number; name: string; email?: string };
  project?: { id: number; name: string } | null;
  createdAt: string;
}

// ==================== API Types ====================
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    overdue: number;
  };
  totalMembers: number;
  recentActivities: ActivityLog[];
}
