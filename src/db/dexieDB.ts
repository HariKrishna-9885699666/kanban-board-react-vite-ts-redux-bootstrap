import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  description: string;
  type: 'Bug' | 'Story' | 'Feature' | 'Task';
  assignee: string;
  column: string;
}

export class KanbanDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('kanbanDB');
    this.version(1).stores({
      tasks: '++id, title, description, type, assignee, column'
    });
  }
}

export const db = new KanbanDB();
