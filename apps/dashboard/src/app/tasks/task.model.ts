export interface Task {
  id?: number;
  title: string;
  description?: string;
  type: 'Work' | 'Personal';
  status: 'Todo' | 'In-Progress' | 'In-Test' | 'Done';
  createdAt?: string;
  updatedAt?: string;
  organization?: { id: number; name: string };
  owner?: { id: number; email: string };
}
