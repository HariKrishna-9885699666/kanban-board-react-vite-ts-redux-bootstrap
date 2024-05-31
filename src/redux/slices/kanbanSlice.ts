import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@db/dexieDB';

interface KanbanState {
  tasks: Task[];
}

const initialState: KanbanState = {
  tasks: [],
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      state.tasks[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = kanbanSlice.actions;

const selectTasks = (state: { kanban: KanbanState }) => state.kanban.tasks;

export const selectTasksByColumnAndAssignee = createSelector(
  [selectTasks, (_, column: string, assignee: string) => ({ column, assignee })],
  (tasks, { column, assignee }) => tasks.filter(task => task.column === column && task.assignee === assignee)
);

export default kanbanSlice.reducer;
