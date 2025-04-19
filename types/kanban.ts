export type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  subtasks?: { title: string; done: boolean }[];
};

export type Board = {
  id: string;
  name: string;
  columns: {
    name: string;
    tasks: Task[];
  }[];
};
