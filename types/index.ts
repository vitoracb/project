// Common types used throughout the application

export type User = {
  id: string;
  email: string;
  name: string;
  profileImage?: string | null;
  role: UserRole;
  createdAt: string;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  receipt?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export type Payment = {
  id: string;
  year: number;
  month: number;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  assigneeId?: string | null;
};

export type Activity = {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  allDay: boolean;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export enum DocumentCategory {
  ESCRITURA = 'ESCRITURA',
  MAPAS = 'MAPAS',
  CERTIDAO_ONUS = 'CERTIDAO_ONUS',
  COMPROVANTES_PAGAMENTO = 'COMPROVANTES_PAGAMENTO',
  OUTROS = 'OUTROS',
}

export type Document = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: DocumentCategory;
  createdAt: string;
  updatedAt: string;
  uploaderId: string;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  taskId?: string | null;
};

export type CashFlow = {
  id: string;
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  receipt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum NotificationType {
  TASK = 'TASK',
  PAYMENT = 'PAYMENT',
  COMMENT = 'COMMENT',
  DOCUMENT = 'DOCUMENT',
  ACTIVITY = 'ACTIVITY',
  SYSTEM = 'SYSTEM',
}

export type Notification = {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: string;
  recipientId: string;
};