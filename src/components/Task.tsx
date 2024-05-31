import React, { useState } from 'react';
import { Task as TaskType } from '@db/dexieDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '@redux/slices/kanbanSlice';
import { db } from '@db/dexieDB';
import { users } from "@lib/constants";

interface TaskProps {
  task: TaskType;
  onDragStart: (e: React.DragEvent, task: TaskType) => void;
}

const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<TaskType>(task);
  const dispatch = useDispatch();

  const getColorClass = () => {
    switch (task.column) {
      case 'To Do':
        return 'bg-primary text-white';
      case 'In Progress':
        return 'bg-warning text-dark';
      case 'In Review':
        return 'bg-secondary bg-gradient text-white';
      case 'Done':
        return 'bg-success text-white';
      default:
        return '';
    }
  };

  const handleEditClick = () => setShowModal(true);
  const handleDeleteClick = async () => {
    if (task.id !== undefined) {
      await db.tasks.delete(task.id);
      dispatch(deleteTask(task.id));
    }
  };

  const handleSaveChanges = async () => {
    await db.tasks.put(editTask);
    dispatch(updateTask(editTask));
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`card mb-2 border-0 ${getColorClass()}`}
        draggable
        onDragStart={(event) => onDragStart(event, task)}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <p className="card-text"><strong>Type:</strong> {task.type}</p>
            <p className="card-text"><strong>Assignee:</strong> {task.assignee}</p>
          </div>
          <div className="d-flex cursor-pointer">
            <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} className="me-2 cursor-pointer" />
            <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} className="cursor-pointer" />
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskType" className="mt-2">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={editTask.type}
                onChange={(e) =>
                  setEditTask({
                    ...editTask,
                    type: e.target.value as
                      | "Bug"
                      | "Story"
                      | "Feature"
                      | "Task",
                  })
                }
              >
                <option value="Bug">Bug</option>
                <option value="Story">Story</option>
                <option value="Feature">Feature</option>
                <option value="Task">Task</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTaskAssignee" className="mt-2">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                as="select"
                value={editTask.assignee}
                onChange={(e) => setEditTask({ ...editTask, assignee: e.target.value })}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Task;