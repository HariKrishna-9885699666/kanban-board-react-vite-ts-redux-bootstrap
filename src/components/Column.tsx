import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Task from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Task as TaskType } from "@db/dexieDB";
import {
  addTask,
  updateTask,
  selectTasksByColumnAndAssignee,
} from "@redux/slices/kanbanSlice";
import { db } from "@db/dexieDB";

interface ColumnProps {
  title: string;
  assignee: string;
}

interface FormValues {
  title: string;
  description: string;
  type: "Bug" | "Story" | "Feature" | "Task";
}

const Column: React.FC<ColumnProps> = ({ title, assignee }) => {
  const tasks = useSelector((state: RootState) =>
    selectTasksByColumnAndAssignee(state, title, assignee)
  );
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleAddTask: SubmitHandler<FormValues> = async (data) => {
    const newTaskWithColumn = { ...data, column: title, assignee };
    const id = await db.tasks.add(newTaskWithColumn);
    dispatch(addTask({ ...newTaskWithColumn, id }));
    reset();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    const taskData = e.dataTransfer.getData("task");
    if (taskData) {
      const task: TaskType = JSON.parse(taskData);
      const columns = ["To Do", "In Progress", "In Review", "Done"];
      const currentIndex = columns.indexOf(task.column);
      if (columns[currentIndex + 1] === title) {
        const updatedTask = { ...task, column: title };
        await db.tasks.put(updatedTask);
        dispatch(updateTask(updatedTask));
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, task: TaskType) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
  };

  return (
    <div
      className="col border border-dark me-1"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{title}</h3>
      <div className="card border-0">
        {tasks.length === 0 ? (
          <p>No tasks to display</p>
        ) : (
          tasks.map((task: TaskType) => (
            <Task
              key={task.id}
              task={task}
              onDragStart={(e) => handleDragStart(e, task)}
            />
          ))
        )}
      </div>
      {title === "To Do" && (
        <form onSubmit={handleSubmit(handleAddTask)}>
          <input
            type="text"
            className={`form-control mt-2 ${errors.title ? "is-invalid" : ""}`}
            placeholder="New Task Title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title.message}</div>
          )}

          <textarea
            className={`form-control mt-2 ${
              errors.description ? "is-invalid" : ""
            }`}
            placeholder="New Task Description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}

          <select
            className={`form-control mt-2 ${errors.type ? "is-invalid" : ""}`}
            {...register("type", { required: "Type is required" })}
          >
            <option value="Bug">Bug</option>
            <option value="Story">Story</option>
            <option value="Feature">Feature</option>
            <option value="Task">Task</option>
          </select>
          {errors.type && (
            <div className="invalid-feedback">{errors.type.message}</div>
          )}

          <button type="submit" className="btn btn-primary mt-2 mb-2">
            Add Task
          </button>
        </form>
      )}
    </div>
  );
};

export default Column;
